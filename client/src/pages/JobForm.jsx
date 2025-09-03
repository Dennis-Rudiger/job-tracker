import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'

export default function JobForm({ mode }) {
  const nav = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({ company: '', position: '', status: 'applied', location: '', salary: '', link: '', notes: '', dateApplied: '', interviewDates: [''], offerDate: '', rejectedDate: '' })
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
          notes: job.notes || '',
          dateApplied: job.dateApplied ? job.dateApplied.slice(0,10) : '',
          interviewDates: Array.isArray(job.interviewDates) && job.interviewDates.length ? job.interviewDates.map(d => (typeof d === 'string' ? d.slice(0,10) : new Date(d).toISOString().slice(0,10))) : [''],
          offerDate: job.offerDate ? job.offerDate.slice(0,10) : '',
          rejectedDate: job.rejectedDate ? job.rejectedDate.slice(0,10) : ''
        })
        setLoading(false)
      }).catch(e => {
        setError(e?.response?.data?.message || 'Failed to load job')
        setLoading(false)
      })
    }
  }, [id, isEdit])

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onChangeInterview = (idx, value) => setForm(f => {
    const arr = [...f.interviewDates]
    arr[idx] = value
    return { ...f, interviewDates: arr }
  })
  const addInterview = () => setForm(f => ({ ...f, interviewDates: [...f.interviewDates, ''] }))
  const removeInterview = (idx) => setForm(f => ({ ...f, interviewDates: f.interviewDates.filter((_, i) => i !== idx) }))

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        salary: form.salary ? Number(form.salary) : undefined,
        dateApplied: form.dateApplied ? new Date(form.dateApplied).toISOString() : undefined,
        interviewDates: Array.isArray(form.interviewDates) ? form.interviewDates.filter(Boolean).map(d => new Date(d).toISOString()) : undefined,
        offerDate: form.offerDate ? new Date(form.offerDate).toISOString() : undefined,
        rejectedDate: form.rejectedDate ? new Date(form.rejectedDate).toISOString() : undefined,
      }
      if (isEdit) await api.patch(`/jobs/${id}`, payload)
      else await api.post('/jobs', payload)
      nav('/jobs')
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save job')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Job' : 'Add Job'}</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="company" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="Company" value={form.company} onChange={onChange} required />
        <input name="position" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="Position" value={form.position} onChange={onChange} required />
        <select name="status" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" value={form.status} onChange={onChange}>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
  <input name="location" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="Location" value={form.location} onChange={onChange} />
  <input name="salary" type="number" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="Salary" value={form.salary} onChange={onChange} />
  <input name="link" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="Link" value={form.link} onChange={onChange} />
  <textarea name="notes" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" placeholder="Notes" value={form.notes} onChange={onChange} />
        <div className="grid gap-2">
          <label className="text-sm text-gray-700">Dates</label>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <span className="text-xs text-gray-600 dark:text-gray-300">Date Applied</span>
              <input name="dateApplied" type="date" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" value={form.dateApplied} onChange={onChange} />
            </div>
            <div className="grid gap-1">
        <span className="text-xs text-gray-600 dark:text-gray-300">Interview Dates</span>
              {form.interviewDates.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2">
          <input type="date" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded flex-1" value={d} onChange={(e) => onChangeInterview(idx, e.target.value)} />
                  {form.interviewDates.length > 1 && (
                    <button type="button" onClick={() => removeInterview(idx)} className="text-red-600 text-sm">Remove</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addInterview} className="text-blue-600 text-sm">+ Add interview date</button>
            </div>
            <div className="grid gap-1">
        <span className="text-xs text-gray-600 dark:text-gray-300">Offer Date</span>
        <input name="offerDate" type="date" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" value={form.offerDate} onChange={onChange} />
            </div>
            <div className="grid gap-1">
        <span className="text-xs text-gray-600 dark:text-gray-300">Rejected Date</span>
        <input name="rejectedDate" type="date" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded" value={form.rejectedDate} onChange={onChange} />
            </div>
          </div>
        </div>
        <button className="bg-blue-600 text-white py-2 rounded">{isEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  )
}
