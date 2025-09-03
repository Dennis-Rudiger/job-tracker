import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get('/jobs')
        setJobs(data.data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load jobs')
      } finally { setLoading(false) }
    }
    run()
  }, [])

  if (loading) return <div>Loading jobs...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Jobs</h1>
        <Link to="/jobs/new" className="text-blue-600">Add Job</Link>
      </div>
      <div className="grid gap-3">
        {jobs.map(j => (
          <div key={j._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{j.company} — {j.position}</div>
              <div className="text-sm text-gray-600">Status: {j.status}</div>
            </div>
            <div className="space-x-3">
              <Link to={`/jobs/${j._id}`} className="text-blue-600">Edit</Link>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <div>No jobs yet. Click Add Job to create one.</div>}
      </div>
    </div>
  )
}
