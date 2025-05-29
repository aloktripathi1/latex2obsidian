"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Trash2, RefreshCw, Moon, Sun, Info, Zap, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// LaTeX conversion logic
function convertLatexToObsidian(input: string): string {
  if (!input.trim()) return ""

  let result = input

  // 1. Convert inline math $$...$$ → $...$
  result = result.replace(/\\$$/g, "$").replace(/\\$$/g, "$")

  // 2. Convert block math \[...\] → $$...$$
  result = result.replace(/\\\[/g, "$$").replace(/\\\]/g, "$$")

  // 3. Convert environments to aligned within $$ blocks
  result = result.replace(/\\begin\{(align\*?|eqnarray\*?)\}([\s\S]*?)\\end\{\1\}/g, (match, env, content) => {
    return `$$\\begin{aligned}${content}\\end{aligned}$$`
  })

  // Handle other environments that should be wrapped in $$
  result = result.replace(
    /\\begin\{(cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\}([\s\S]*?)\\end\{\1\}/g,
    (match, env, content) => {
      if (!match.includes("$$")) {
        return `$$\\begin{${env}}${content}\\end{${env}}$$`
      }
      return match
    },
  )

  // 4. Remove unnecessary \displaystyle
  result = result.replace(/\\displaystyle\s*/g, "")

  // 5. Fix character escaping
  result = result.replace(/(?<!\\)_(?![a-zA-Z0-9{])/g, "\\_")
  result = result.replace(/(?<!\\)\^(?![a-zA-Z0-9{])/g, "\\^")

  // 6. Normalize whitespace
  result = result.replace(/[ \t]+$/gm, "")
  result = result.replace(/\n\s*\n\s*\n/g, "\n\n")
  result = result.replace(/\$\$\s*\n/g, "$$\n")
  result = result.replace(/\n\s*\$\$/g, "\n$$")

  // 7. Fix common LaTeX issues
  result = result.replace(/\\text\{\{([^}]+)\}\}/g, "\\text{$1}")
  result = result.replace(/\{\{([^{}]+)\}\}/g, "{$1}")

  return result.trim()
}

export default function LatexConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [autoConvert, setAutoConvert] = useState(true)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionCount, setConversionCount] = useState(0)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Debounced conversion
  const debouncedConvert = useCallback(
    debounce((text: string) => {
      if (autoConvert && text.trim()) {
        setIsConverting(true)
        setTimeout(() => {
          const converted = convertLatexToObsidian(text)
          setOutput(converted)
          setIsConverting(false)
          setConversionCount((prev) => prev + 1)
        }, 100)
      } else if (!text.trim()) {
        setOutput("")
      }
    }, 300),
    [autoConvert],
  )

  useEffect(() => {
    debouncedConvert(input)
  }, [input, debouncedConvert])

  const handleManualConvert = () => {
    if (!input.trim()) return
    setIsConverting(true)
    setTimeout(() => {
      const converted = convertLatexToObsidian(input)
      setOutput(converted)
      setIsConverting(false)
      setConversionCount((prev) => prev + 1)
      toast({
        title: "✨ Conversion Complete",
        description: "Your LaTeX has been successfully converted!",
      })
    }, 200)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast({
        title: "📋 Copied!",
        description: "LaTeX copied to clipboard successfully",
      })
    } catch (err) {
      toast({
        title: "❌ Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setConversionCount(0)
    toast({
      title: "🧹 Cleared",
      description: "All content has been cleared",
    })
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const hasContent = input.trim().length > 0
  const hasOutput = output.trim().length > 0

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <header className="relative backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      LaTeX Formatter
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">ChatGPT → Obsidian</p>
                  </div>
                </div>

                {conversionCount > 0 && (
                  <Badge variant="secondary" className="animate-in slide-in-from-left-2 duration-300">
                    {conversionCount} conversion{conversionCount !== 1 ? "s" : ""}
                  </Badge>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>Converts ChatGPT-style LaTeX to Obsidian-compatible MathJax format with live preview</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative container mx-auto px-6 py-8">
          {/* Controls */}
          <div className="mb-8 flex flex-wrap items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <Switch
                id="auto-convert"
                checked={autoConvert}
                onCheckedChange={setAutoConvert}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600"
              />
              <Label htmlFor="auto-convert" className="font-medium text-slate-700 dark:text-slate-300">
                Auto-convert
              </Label>
              {autoConvert && (
                <Badge variant="outline" className="text-xs animate-in slide-in-from-right-2">
                  <Zap className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleManualConvert}
                disabled={!hasContent || isConverting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isConverting ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                Convert
              </Button>

              <Button
                onClick={handleClear}
                variant="outline"
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-400 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Main Conversion Area */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Input LaTeX
                  </CardTitle>
                  {hasContent && (
                    <Badge variant="secondary" className="animate-in slide-in-from-right-2">
                      {input.length} chars
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Paste your ChatGPT LaTeX here</p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your ChatGPT LaTeX here...

Example:
\[
\begin{align}
f(x) &= x^2 + 2x + 1 \\
&= (x + 1)^2
\end{align}
\]

Try pasting some LaTeX and watch the magic happen! ✨"
                    className={cn(
                      "min-h-[400px] font-mono text-sm resize-none transition-all duration-200",
                      "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700",
                      "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                      hasContent && "border-green-300 dark:border-green-700",
                    )}
                  />
                  {isConverting && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors duration-200",
                        hasOutput ? "bg-blue-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600",
                      )}
                    ></div>
                    Obsidian Output
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {hasOutput && (
                      <Badge variant="secondary" className="animate-in slide-in-from-right-2">
                        {output.length} chars
                      </Badge>
                    )}
                    <Button
                      onClick={handleCopy}
                      disabled={!hasOutput}
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Ready for Obsidian</p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={output}
                    readOnly
                    placeholder="Converted LaTeX will appear here...

✨ Your Obsidian-compatible LaTeX will be generated automatically as you type!"
                    className={cn(
                      "min-h-[400px] font-mono text-sm resize-none transition-all duration-200",
                      "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700",
                      hasOutput && "border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/30",
                    )}
                  />
                  {hasOutput && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="h-5 w-5 text-green-500 animate-in zoom-in-50 duration-300" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Examples */}
          <Card className="mt-12 bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Info className="h-4 w-4 text-white" />
                </div>
                Conversion Examples
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">See how different LaTeX formats are converted</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Example 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">ChatGPT Style</h4>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <code className="text-sm font-mono text-amber-800 dark:text-amber-200">$$x^2 + y^2 = r^2$$</code>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">Obsidian Compatible</h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <code className="text-sm font-mono text-green-800 dark:text-green-200">$x^2 + y^2 = r^2$</code>
                  </div>
                </div>
              </div>

              {/* Example 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">ChatGPT Style</h4>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <code className="text-sm font-mono text-amber-800 dark:text-amber-200 whitespace-pre">
                      {`\\begin{align}
f(x) &= x^2 \\\\
g(x) &= 2x
\\end{align}`}
                    </code>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">Obsidian Compatible</h4>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <code className="text-sm font-mono text-green-800 dark:text-green-200 whitespace-pre">
                      {`$$\\begin{aligned}
f(x) &= x^2 \\\\
g(x) &= 2x
\\end{aligned}$$`}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="relative mt-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center space-y-2">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                This app converts LaTeX expressions based on MathJax support used by Obsidian.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                v1.0 • Built with Next.js, Tailwind CSS, and ❤️
              </p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
