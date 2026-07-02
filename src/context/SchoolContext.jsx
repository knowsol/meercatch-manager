'use client'
import { createContext, useContext, useState } from 'react'
import { DUMMY } from '../data/dummy'

const SchoolCtx = createContext(null)

export function SchoolProvider({ children }) {
  const [selectedSchoolId, setSelectedSchoolId] = useState(DUMMY.schools[0]?.schoolId ?? null)
  return (
    <SchoolCtx.Provider value={{ selectedSchoolId, setSelectedSchoolId }}>
      {children}
    </SchoolCtx.Provider>
  )
}

export const useSchool = () => useContext(SchoolCtx)
