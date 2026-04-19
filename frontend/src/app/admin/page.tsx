"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GovHeader, GovFooter } from '@/components/layout'
import { api, Submission, AuditLog } from '@/lib/api'
import { Download, FileText, ClipboardList, RefreshCw, LogOut } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/')
      return
    }
    const user = JSON.parse(storedUser)
    if (!user.is_admin) {
      router.push('/')
      return
    }
    
    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    try {
      const [subs, logs] = await Promise.all([
        api.getSubmissions(),
        api.getAuditLogs(200)
      ])
      setSubmissions(subs)
      setAuditLogs(logs)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await api.exportCSV()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to export CSV')
    } finally {
      setExporting(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-red" />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gov-blue-dark">Admin Dashboard</h1>
              <p className="text-gov-gray">Manage submissions and view activity logs</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="success"
                onClick={handleExport}
                disabled={exporting}
                data-testid="export-csv-btn"
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? 'EXPORTING...' : 'EXPORT CSV'}
              </Button>
              <Button
                variant="outline"
                className="text-gov-red border-gov-red hover:bg-gov-red hover:text-white"
                onClick={handleLogout}
                data-testid="admin-logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          </div>

          <Tabs defaultValue="submissions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="submissions" className="flex items-center gap-2" data-testid="submissions-tab">
                <FileText className="w-4 h-4" />
                Submissions ({submissions.length})
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2" data-testid="audit-logs-tab">
                <ClipboardList className="w-4 h-4" />
                Audit Log ({auditLogs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions">
              {loading ? (
                <div className="text-center py-12 text-gov-gray">Loading...</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border">No submissions yet</div>
              ) : (
                <div className="bg-white border shadow-sm overflow-x-auto">
                  <div className="bg-gov-blue text-white p-4 flex justify-between items-center">
                    <h2 className="font-bold">USER SUBMISSIONS</h2>
                    <Button variant="ghost" size="sm" onClick={loadData} className="text-white hover:bg-gov-blue-dark">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <table className="w-full text-sm" data-testid="submissions-table">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3 text-xs font-bold uppercase">Email</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">Name</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">SSN</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">DOB</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">Phone</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">Citation</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">Action</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="border-t hover:bg-gray-50">
                          <td className="p-3">{sub.email}</td>
                          <td className="p-3 font-semibold">{sub.name || '-'}</td>
                          <td className="p-3 font-mono text-gov-red">{sub.ssn || '-'}</td>
                          <td className="p-3">{sub.dob || '-'}</td>
                          <td className="p-3">{sub.phone || '-'}</td>
                          <td className="p-3 font-mono text-gov-blue">{sub.citation_searched || '-'}</td>
                          <td className="p-3">{sub.action_taken || '-'}</td>
                          <td className="p-3 text-xs text-gov-gray">{formatDate(sub.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit">
              {loading ? (
                <div className="text-center py-12 text-gov-gray">Loading...</div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border">No audit logs yet</div>
              ) : (
                <div className="bg-white border shadow-sm overflow-x-auto">
                  <div className="bg-gov-blue-dark text-white p-4 flex justify-between items-center">
                    <h2 className="font-bold">ACTIVITY AUDIT LOG</h2>
                    <Button variant="ghost" size="sm" onClick={loadData} className="text-white hover:bg-gov-blue">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <table className="w-full text-sm" data-testid="audit-logs-table">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3 text-xs font-bold uppercase">Timestamp</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">Action</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">User</th>
                        <th className="text-left p-3 text-xs font-bold uppercase">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="border-t hover:bg-gray-50">
                          <td className="p-3 text-xs font-mono text-gov-gray">{formatDate(log.timestamp)}</td>
                          <td className="p-3 font-semibold text-gov-blue">{log.action}</td>
                          <td className="p-3">{log.user_email}</td>
                          <td className="p-3 text-xs text-gov-gray max-w-xs truncate">{log.details || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
