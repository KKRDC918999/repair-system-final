"use client"
import { useEffect, useState, useContext } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import i18n from '../utils/i18n'
import { LangContext } from '../layout'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ReportPage() {
  const { lang } = useContext(LangContext) as { lang: 'th' | 'en' }
  const [monthly, setMonthly] = useState<{ label: string, count: number, avgSla: number }[]>([])
  const [deptStats, setDeptStats] = useState<{ department: string, count: number, avgSla: number }[]>([])
  const [techStats, setTechStats] = useState<{ name: string, count: number, avgSla: number }[]>([])
  const [statusStats, setStatusStats] = useState<{ month: string, pending: number, inprogress: number, completed: number }[]>([])
  const [filterMonth, setFilterMonth] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTech, setFilterTech] = useState('')
  const [techOptions, setTechOptions] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const monthOptions = Array.from(new Set(monthly.map(m => m.label)))
  const deptOptions = Array.from(new Set(deptStats.map(d => d.department)))
  const statusOptions = [i18n[lang].pending, i18n[lang].inprogress, i18n[lang].done]
  const [filterPresets, setFilterPresets] = useState<{ name: string, filters: any }[]>([])
  const [presetName, setPresetName] = useState('')
  useEffect(() => {
    const saved = localStorage.getItem('reportFilterPresets')
    if (saved) setFilterPresets(JSON.parse(saved))
  }, [])
  function savePreset() {
    if (!presetName) return
    const newPresets = [...filterPresets, {
      name: presetName,
      filters: { startDate, endDate, filterMonth, filterDept, filterTech, filterStatus }
    }]
    setFilterPresets(newPresets)
    localStorage.setItem('reportFilterPresets', JSON.stringify(newPresets))
    setPresetName('')
  }
  function loadPreset(filters: any) {
    setStartDate(filters.startDate)
    setEndDate(filters.endDate)
    setFilterMonth(filters.filterMonth)
    setFilterDept(filters.filterDept)
    setFilterTech(filters.filterTech)
    setFilterStatus(filters.filterStatus)
  }
  function deletePreset(name: string) {
    if (!confirm(i18n[lang].confirmDeletePreset || 'ยืนยันการลบ Preset นี้?')) return
    const newPresets = filterPresets.filter(p => p.name !== name)
    setFilterPresets(newPresets)
    localStorage.setItem('reportFilterPresets', JSON.stringify(newPresets))
  }

  useEffect(() => {
    fetchMonthly()
    fetchDeptStats()
    fetchTechStats()
    fetchStatusStats()
    fetchTechOptions()
  }, [])

  async function fetchMonthly() {
    const { data, error } = await supabase.from('repair_requests').select('created_at, updated_at, status')
    if (!error && data) {
      const monthMap: { [key: string]: { count: number, slaSum: number, slaCount: number } } = {}
      data.forEach((r: any) => {
        const d = new Date(r.created_at)
        const label = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
        if (!monthMap[label]) monthMap[label] = { count: 0, slaSum: 0, slaCount: 0 }
        monthMap[label].count++
        if (r.status === 'completed' && r.updated_at) {
          const sla = (new Date(r.updated_at).getTime() - new Date(r.created_at).getTime()) / 3600000
          monthMap[label].slaSum += sla
          monthMap[label].slaCount++
        }
      })
      const arr = Object.entries(monthMap).sort().map(([label, v]) => ({
        label,
        count: v.count,
        avgSla: v.slaCount ? v.slaSum / v.slaCount : 0,
      }))
      setMonthly(arr)
    }
  }

  async function fetchDeptStats() {
    const { data, error } = await supabase.from('repair_requests').select('department, created_at, updated_at, status')
    if (!error && data) {
      const deptMap: { [key: string]: { count: number, slaSum: number, slaCount: number } } = {}
      data.forEach((r: any) => {
        const dept = r.department || i18n[lang].noData
        if (!deptMap[dept]) deptMap[dept] = { count: 0, slaSum: 0, slaCount: 0 }
        deptMap[dept].count++
        if (r.status === 'completed' && r.updated_at) {
          const sla = (new Date(r.updated_at).getTime() - new Date(r.created_at).getTime()) / 3600000
          deptMap[dept].slaSum += sla
          deptMap[dept].slaCount++
        }
      })
      const arr = Object.entries(deptMap).sort().map(([department, v]) => ({
        department,
        count: v.count,
        avgSla: v.slaCount ? v.slaSum / v.slaCount : 0,
      }))
      setDeptStats(arr)
    }
  }

  async function fetchTechStats() {
    const { data, error } = await supabase.from('repair_requests').select('assigned_to, created_at, updated_at, status')
    const { data: users, error: userError } = await supabase.from('users').select('id, name').eq('role', 'technician')
    if (!error && !userError && data && users) {
      const techMap: { [key: string]: { name: string, count: number, slaSum: number, slaCount: number } } = {}
      users.forEach((u: any) => {
        techMap[u.id] = { name: u.name, count: 0, slaSum: 0, slaCount: 0 }
      })
      data.forEach((r: any) => {
        if (!r.assigned_to || !techMap[r.assigned_to]) return
        techMap[r.assigned_to].count++
        if (r.status === 'completed' && r.updated_at) {
          const sla = (new Date(r.updated_at).getTime() - new Date(r.created_at).getTime()) / 3600000
          techMap[r.assigned_to].slaSum += sla
          techMap[r.assigned_to].slaCount++
        }
      })
      const arr = Object.values(techMap).map(t => ({
        name: t.name,
        count: t.count,
        avgSla: t.slaCount ? t.slaSum / t.slaCount : 0,
      })).sort((a, b) => b.count - a.count)
      setTechStats(arr)
    }
  }

  async function fetchStatusStats() {
    const { data, error } = await supabase.from('repair_requests').select('created_at, status')
    if (!error && data) {
      const monthMap: { [key: string]: { pending: number, inprogress: number, completed: number } } = {}
      data.forEach((r: any) => {
        const d = new Date(r.created_at)
        const month = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
        if (!monthMap[month]) monthMap[month] = { pending: 0, inprogress: 0, completed: 0 }
        if (r.status === 'pending') monthMap[month].pending++
        else if (r.status === 'inprogress' || r.status === 'in-progress') monthMap[month].inprogress++
        else if (r.status === 'completed' || r.status === 'done') monthMap[month].completed++
      })
      const arr = Object.entries(monthMap).sort().map(([month, v]) => ({ month, ...v }))
      setStatusStats(arr)
    }
  }

  async function fetchTechOptions() {
    const { data, error } = await supabase.from('users').select('name').eq('role', 'technician')
    if (!error && data) setTechOptions(data.map((u: any) => u.name))
  }

  function handleExportCSV() {
    const csv = [
      ['--- Monthly KPI/SLA ---'],
      Papa.unparse(filteredMonthly),
      ['--- Department KPI/SLA ---'],
      Papa.unparse(filteredDept),
      ['--- Technician KPI/SLA ---'],
      Papa.unparse(filteredTech),
      ['--- Status by Month ---'],
      Papa.unparse(filteredStatus),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function handleExportExcel() {
    const wb = XLSX.utils.book_new()
    const wsMonthly = XLSX.utils.json_to_sheet(filteredMonthly)
    XLSX.utils.book_append_sheet(wb, wsMonthly, 'Monthly KPI/SLA')
    const wsDept = XLSX.utils.json_to_sheet(filteredDept)
    XLSX.utils.book_append_sheet(wb, wsDept, 'Department KPI/SLA')
    const wsTech = XLSX.utils.json_to_sheet(filteredTech)
    XLSX.utils.book_append_sheet(wb, wsTech, 'Technician KPI/SLA')
    const wsStatus = XLSX.utils.json_to_sheet(filteredStatus)
    XLSX.utils.book_append_sheet(wb, wsStatus, 'Status by Month')
    XLSX.writeFile(wb, 'report.xlsx')
  }

  function handleExportPDF() {
    const doc = new jsPDF()
    let y = 10
    doc.setFontSize(16)
    doc.text(i18n[lang].monthlyTrend, 10, y)
    y += 6
    doc.autoTable({
      startY: y,
      head: [[i18n[lang].date, i18n[lang].total, i18n[lang].avgSla]],
      body: filteredMonthly.map(m => [m.label, m.count, m.avgSla.toFixed(2) + ' ' + i18n[lang].hours]),
    })
    y = doc.lastAutoTable.finalY + 10
    doc.text(i18n[lang].deptReport, 10, y)
    y += 6
    doc.autoTable({
      startY: y,
      head: [[i18n[lang].department, i18n[lang].total, i18n[lang].avgSla]],
      body: filteredDept.map(d => [d.department, d.count, d.avgSla.toFixed(2) + ' ' + i18n[lang].hours]),
    })
    y = doc.lastAutoTable.finalY + 10
    doc.text(i18n[lang].techReport, 10, y)
    y += 6
    doc.autoTable({
      startY: y,
      head: [[i18n[lang].technician, i18n[lang].total, i18n[lang].avgSla]],
      body: filteredTech.map(t => [t.name, t.count, t.avgSla.toFixed(2) + ' ' + i18n[lang].hours]),
    })
    y = doc.lastAutoTable.finalY + 10
    doc.text(i18n[lang].statusReport, 10, y)
    y += 6
    doc.autoTable({
      startY: y,
      head: [[i18n[lang].date, i18n[lang].pending, i18n[lang].inprogress, i18n[lang].done]],
      body: filteredStatus.map(s => [s.month, s.pending, s.inprogress, s.completed]),
    })
    doc.save('report.pdf')
  }

  function handleExportPresets() {
    const blob = new Blob([JSON.stringify(filterPresets, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'filter-presets.json')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  function handleImportPresets(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string)
        if (Array.isArray(imported)) {
          setFilterPresets(imported)
          localStorage.setItem('reportFilterPresets', JSON.stringify(imported))
        }
      } catch {}
    }
    reader.readAsText(file)
  }

  function handlePrint() {
    window.print()
  }

  function setPresetRange(preset: string) {
    const now = new Date()
    if (preset === 'thisMonth') {
      setStartDate(now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-01')
      setEndDate(now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0'))
    } else if (preset === 'lastMonth') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      setStartDate(lastMonth.getFullYear() + '-' + String(lastMonth.getMonth() + 1).padStart(2, '0') + '-01')
      setEndDate(lastMonth.getFullYear() + '-' + String(lastMonth.getMonth() + 1).padStart(2, '0') + '-' + String(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).getDate()).padStart(2, '0'))
    } else if (preset === 'thisYear') {
      setStartDate(now.getFullYear() + '-01-01')
      setEndDate(now.getFullYear() + '-12-31')
    } else if (preset === 'lastYear') {
      setStartDate((now.getFullYear() - 1) + '-01-01')
      setEndDate((now.getFullYear() - 1) + '-12-31')
    } else {
      setStartDate('')
      setEndDate('')
    }
  }

  const barData = {
    labels: monthly.map(m => m.label),
    datasets: [
      {
        label: i18n[lang].total,
        data: monthly.map(m => m.count),
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderRadius: 8,
      },
    ],
  }
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: i18n[lang].monthlyTrend },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  }
  const deptBarData = {
    labels: deptStats.map(d => d.department),
    datasets: [
      {
        label: i18n[lang].total,
        data: deptStats.map(d => d.count),
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderRadius: 8,
      },
    ],
  }
  const deptBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: i18n[lang].deptReport || 'รายงานแผนก' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  }
  const techBarData = {
    labels: techStats.map(t => t.name),
    datasets: [
      {
        label: i18n[lang].total,
        data: techStats.map(t => t.count),
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderRadius: 8,
      },
    ],
  }
  const techBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: i18n[lang].techReport || 'รายงานช่าง' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  }
  const statusBarData = {
    labels: statusStats.map(s => s.month),
    datasets: [
      {
        label: i18n[lang].pending,
        data: statusStats.map(s => s.pending),
        backgroundColor: 'rgba(251,191,36,0.7)',
        borderRadius: 8,
      },
      {
        label: i18n[lang].inprogress,
        data: statusStats.map(s => s.inprogress),
        backgroundColor: 'rgba(99,102,241,0.7)',
        borderRadius: 8,
      },
      {
        label: i18n[lang].done,
        data: statusStats.map(s => s.completed),
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderRadius: 8,
      },
    ],
  }
  const statusBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: i18n[lang].statusReport || 'รายงานสถานะงานรายเดือน' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  }

  // กรองข้อมูลตาม filter
  function inDateRange(dateStr: string) {
    if (!startDate && !endDate) return true
    const d = new Date(dateStr)
    if (startDate && d < new Date(startDate)) return false
    if (endDate && d > new Date(endDate + 'T23:59:59')) return false
    return true
  }
  const filteredMonthly = (filterMonth ? monthly.filter(m => m.label === filterMonth) : monthly).filter(m => {
    if (!startDate && !endDate) return true
    // m.label = yyyy-mm, check if in range
    const d = new Date(m.label + '-01')
    if (startDate && d < new Date(startDate)) return false
    if (endDate && d > new Date(endDate + 'T23:59:59')) return false
    return true
  })
  const filteredDept = filterDept ? deptStats.filter(d => d.department === filterDept) : deptStats
  const filteredStatus = (filterStatus ? statusStats.map(s => ({...s, pending: filterStatus === i18n[lang].pending ? s.pending : 0, inprogress: filterStatus === i18n[lang].inprogress ? s.inprogress : 0, completed: filterStatus === i18n[lang].done ? s.completed : 0})) : statusStats).filter(s => inDateRange(s.month + '-01'))
  const filteredTech = filterTech ? techStats.filter(t => t.name === filterTech) : techStats

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 mb-8">
        <div className="flex justify-end mb-4 gap-2">
          <button className="btn-primary" onClick={handleExportCSV}>{i18n[lang].exportCSV || 'Export CSV'}</button>
          <button className="btn-secondary" onClick={handleExportExcel}>{i18n[lang].exportExcel || 'Export Excel'}</button>
          <button className="btn-secondary" onClick={handleExportPDF}>{i18n[lang].exportPDF || 'Export PDF'}</button>
          <button className="btn-secondary" onClick={handlePrint}>{i18n[lang].print || 'Print'}</button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6 print-hidden">
          <button className="btn-secondary" type="button" onClick={handleExportPresets}>{i18n[lang].exportPreset || 'Export Preset'}</button>
          <label className="btn-secondary cursor-pointer">
            {i18n[lang].importPreset || 'Import Preset'}
            <input type="file" accept=".json" onChange={handleImportPresets} className="hidden" />
          </label>
          <input type="text" className="input-primary w-32" placeholder={i18n[lang].presetName || 'ชื่อชุด Filter'} value={presetName} onChange={e => setPresetName(e.target.value)} />
          <button className="btn-secondary" type="button" onClick={savePreset}>{i18n[lang].savePreset || 'บันทึกชุด Filter'}</button>
          <select className="input-primary w-40" onChange={e => { const p = filterPresets.find(p => p.name === e.target.value); if (p) loadPreset(p.filters) }} defaultValue="">
            <option value="">{i18n[lang].loadPreset || 'โหลดชุด Filter'}</option>
            {filterPresets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
          {filterPresets.map(p => (
            <button key={p.name} className="btn-secondary text-xs" type="button" onClick={() => deletePreset(p.name)}>{i18n[lang].deletePreset || 'ลบ'}: {p.name}</button>
          ))}
          <select className="input-primary" onChange={e => setPresetRange(e.target.value)} defaultValue="">
            <option value="">{i18n[lang].all || 'ทั้งหมด'}</option>
            <option value="thisMonth">{i18n[lang].thisMonth || 'เดือนนี้'}</option>
            <option value="lastMonth">{i18n[lang].lastMonth || 'เดือนที่แล้ว'}</option>
            <option value="thisYear">{i18n[lang].thisYear || 'ปีนี้'}</option>
            <option value="lastYear">{i18n[lang].lastYear || 'ปีที่แล้ว'}</option>
          </select>
          <input type="date" className="input-primary" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" className="input-primary" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <select className="input-primary" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
            <option value="">{i18n[lang].date || 'ทุกเดือน'}</option>
            {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="input-primary" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="">{i18n[lang].department || 'ทุกแผนก'}</option>
            {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="input-primary" value={filterTech} onChange={e => setFilterTech(e.target.value)}>
            <option value="">{i18n[lang].technician || 'ทุกช่าง'}</option>
            {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="input-primary" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">{i18n[lang].status || 'ทุกสถานะ'}</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <h1 className="text-2xl font-bold mb-6">{i18n[lang].monthlyTrend}</h1>
        <div className="mb-2 text-sm text-gray-500">{i18n[lang].showing || 'แสดง'} {filteredMonthly.length} {i18n[lang].items || 'รายการ'}</div>
        <Bar data={{...barData, labels: filteredMonthly.map(m => m.label), datasets: [{...barData.datasets[0], data: filteredMonthly.map(m => m.count)}]}} options={barOptions} className="w-full" />
        <h2 className="text-xl font-semibold mt-8 mb-4">KPI/SLA</h2>
        <div className="mb-2 text-sm text-gray-500">{i18n[lang].showing || 'แสดง'} {filteredMonthly.length} {i18n[lang].items || 'รายการ'}</div>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">{i18n[lang].date || 'เดือน'}</th>
                <th className="px-4 py-2 border">{i18n[lang].total || 'จำนวนงาน'}</th>
                <th className="px-4 py-2 border">{i18n[lang].avgSla || 'SLA เฉลี่ย'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredMonthly.map(m => (
                <tr key={m.label}>
                  <td className="px-4 py-2 border">{m.label}</td>
                  <td className="px-4 py-2 border">{m.count}</td>
                  <td className="px-4 py-2 border">{m.avgSla.toFixed(2)} {i18n[lang].hours}</td>
                </tr>
              ))}
              {filteredMonthly.length === 0 && (
                <tr><td colSpan={3} className="text-center py-4">{i18n[lang].noData || 'ไม่มีข้อมูล'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-semibold mt-8 mb-4">{i18n[lang].deptReport || 'รายงานแผนก'}</h2>
        <div className="mb-2 text-sm text-gray-500">{i18n[lang].showing || 'แสดง'} {filteredDept.length} {i18n[lang].items || 'รายการ'}</div>
        <Bar data={{...deptBarData, labels: filteredDept.map(d => d.department), datasets: [{...deptBarData.datasets[0], data: filteredDept.map(d => d.count)}]}} options={deptBarOptions} className="w-full mb-6" />
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">{i18n[lang].department || 'แผนก'}</th>
                <th className="px-4 py-2 border">{i18n[lang].total || 'จำนวนงาน'}</th>
                <th className="px-4 py-2 border">{i18n[lang].avgSla || 'SLA เฉลี่ย'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDept.map(d => (
                <tr key={d.department}>
                  <td className="px-4 py-2 border">{d.department}</td>
                  <td className="px-4 py-2 border">{d.count}</td>
                  <td className="px-4 py-2 border">{d.avgSla.toFixed(2)} {i18n[lang].hours}</td>
                </tr>
              ))}
              {filteredDept.length === 0 && (
                <tr><td colSpan={3} className="text-center py-4">{i18n[lang].noData || 'ไม่มีข้อมูล'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-semibold mt-8 mb-4">{i18n[lang].techReport || 'รายงานช่าง'}</h2>
        <div className="mb-2 text-sm text-gray-500">{i18n[lang].showing || 'แสดง'} {filteredTech.length} {i18n[lang].items || 'รายการ'}</div>
        <Bar data={{...techBarData, labels: filteredTech.map(t => t.name), datasets: [{...techBarData.datasets[0], data: filteredTech.map(t => t.count)}]}} options={techBarOptions} className="w-full mb-6" />
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">{i18n[lang].technician || 'ช่าง'}</th>
                <th className="px-4 py-2 border">{i18n[lang].total || 'จำนวนงาน'}</th>
                <th className="px-4 py-2 border">{i18n[lang].avgSla || 'SLA เฉลี่ย'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTech.map(t => (
                <tr key={t.name}>
                  <td className="px-4 py-2 border">{t.name}</td>
                  <td className="px-4 py-2 border">{t.count}</td>
                  <td className="px-4 py-2 border">{t.avgSla.toFixed(2)} {i18n[lang].hours}</td>
                </tr>
              ))}
              {filteredTech.length === 0 && (
                <tr><td colSpan={3} className="text-center py-4">{i18n[lang].noData || 'ไม่มีข้อมูล'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-semibold mt-8 mb-4">{i18n[lang].statusReport || 'รายงานสถานะงานรายเดือน'}</h2>
        <div className="mb-2 text-sm text-gray-500">{i18n[lang].showing || 'แสดง'} {filteredStatus.length} {i18n[lang].items || 'รายการ'}</div>
        <Bar data={{...statusBarData, labels: filteredStatus.map(s => s.month), datasets: statusBarData.datasets.map((ds, i) => ({...ds, data: filteredStatus.map(s => i === 0 ? s.pending : i === 1 ? s.inprogress : s.completed)}))}} options={statusBarOptions} className="w-full mb-6" />
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">{i18n[lang].date || 'เดือน'}</th>
                <th className="px-4 py-2 border">{i18n[lang].pending || 'รอดำเนินการ'}</th>
                <th className="px-4 py-2 border">{i18n[lang].inprogress || 'กำลังซ่อม'}</th>
                <th className="px-4 py-2 border">{i18n[lang].done || 'ซ่อมสำเร็จ'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStatus.map(s => (
                <tr key={s.month}>
                  <td className="px-4 py-2 border">{s.month}</td>
                  <td className="px-4 py-2 border">{s.pending}</td>
                  <td className="px-4 py-2 border">{s.inprogress}</td>
                  <td className="px-4 py-2 border">{s.completed}</td>
                </tr>
              ))}
              {filteredStatus.length === 0 && (
                <tr><td colSpan={4} className="text-center py-4">{i18n[lang].noData || 'ไม่มีข้อมูล'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 