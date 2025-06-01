'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

const SaveContext = createContext()

export const useSave = () => {
  const context = useContext(SaveContext)
  if (!context) {
    throw new Error('useSave must be used within a SaveProvider')
  }
  return context
}

export const SaveProvider = ({ children }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [saveFunction, setSaveFunction] = useState(null)

  const triggerSave = async () => {
    if (!saveFunction) {
      console.warn('Save function not available')
      return
    }

    setIsSaving(true)
    try {
      await saveFunction()
    } catch (error) {
      console.error('Save failed:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const registerSaveFunction = useCallback((fn) => {
    setSaveFunction(() => fn)
  }, [])

  const value = {
    isSaving,
    triggerSave,
    registerSaveFunction
  }

  return (
    <SaveContext.Provider value={value}>
      {children}
    </SaveContext.Provider>
  )
}
