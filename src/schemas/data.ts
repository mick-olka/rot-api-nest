import { raw } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export const getMongoRef = (name: string, isArray?: boolean) => {
  if (isArray)
    return {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: name }],
      default: [],
    }
  return {
    type: { type: mongoose.Schema.Types.ObjectId, ref: name },
  }
}

// ==============================

export const default_locales = {
  en: '',
  ua: '',
}

export interface I_Locales {
  ua: string
  en: string
}

export const locales = raw({
  ua: { type: String, required: true },
  en: { type: String, required: true },
})

// ================================

export const default_features = {
  ua: [],
  en: [],
}

export interface I_ProductFeatures {
  ua: [
    {
      key: string
      value: string
    },
  ]
  en: [
    {
      key: string
      value: string
    },
  ]
}

export const productFeatures = raw({
  ua: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  en: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
})

// ==================================
