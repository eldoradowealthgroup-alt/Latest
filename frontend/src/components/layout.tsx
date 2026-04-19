import { Scale } from 'lucide-react'

export function GovHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="bg-gov-blue-dark text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="font-bold">An official website of the United States government</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Scale className="w-10 h-10 text-gov-blue" />
          <div>
            <h1 className="text-xl font-bold text-gov-blue-dark">U.S. District Lookup</h1>
            <p className="text-sm text-gov-gray">Electronic Docket Registry</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export function GovFooter() {
  return (
    <footer className="bg-gov-blue-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8" />
            <span className="font-semibold">Administrative Office of the U.S. Courts</span>
          </div>
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} U.S. District Court System
          </p>
        </div>
      </div>
    </footer>
  )
}
