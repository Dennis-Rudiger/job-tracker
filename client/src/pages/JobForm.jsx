import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'

export default function JobForm({ mode }) {
  const nav = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({ company: '', position: '', status: 'applied', location: '', salary: '', link: '', notes: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      api.get(`/jobs/${id}`).then(({ data }) => {
        const { job } = data
        setForm({
          company: job.company || '',
          position: job.position || '',
          status: job.status || 'applied',
          location: job.location || '',
          salary: job.salary || '',
          link: job.link || '',
          notes: job.notes || ''
        })
        setLoading(false)
      }).catch(e => {
        setError(e?.response?.data?.message || 'Failed to load job')
        setLoading(false)
      })
    }
  }, [id, isEdit])

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit) await api.patch(`/jobs/${id}`, { ...form, salary: form.salary ? Number(form.salary) : undefined })
      else await api.post('/jobs', { ...form, salary: form.salary ? Number(form.salary) : undefined })
      nav('/jobs')
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save job')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Job' : 'Add Job'}</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="company" className="border px-3 py-2 rounded" placeholder="Company" value={form.company} onChange={onChange} required />
        <input name="position" className="border px-3 py-2 rounded" placeholder="Position" value={form.position} onChange={onChange} required />
        <select name="status" className="border px-3 py-2 rounded" value={form.status} onChange={onChange}>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <input name="location" className="border px-3 py-2 rounded" placeholder="Location" value={form.location} onChange={onChange} />
        <input name="salary" type="number" className="border px-3 py-2 rounded" placeholder="Salary" value={form.salary} onChange={onChange} />
        <input name="link" className="border px-3 py-2 rounded" placeholder="Link" value={form.link} onChange={onChange} />
        <textarea name="notes" className="border px-3 py-2 rounded" placeholder="Notes" value={form.notes} onChange={onChange} />
        <button className="bg-blue-600 text-white py-2 rounded">{isEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  )
}
