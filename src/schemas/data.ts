import { raw } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export const getMongoRef = (name: string, isArray?: boolean) => {
  if (isArray)
    return {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: name }],
      default: [],
    }
  return { type: mongoose.Schema.Types.ObjectId, ref: name, required: true }
}

// ==============================

export enum E_Languages {
  ua = 'ua',
  en = 'en',
  de = 'de',
}

export const lanEnumToObject = <T>(value: T): { [key in E_Languages]: T } => {
  return {
    en: value,
    ua: value,
    de: value,
  }
}

export type I_Locales = {
  [key in E_Languages]: string
}

export const default_locales: I_Locales = lanEnumToObject('')

export const locales = raw(lanEnumToObject({ type: String, default: '' }))

// ================================

export const default_features = lanEnumToObject([])

export type I_ProductFeatures = {
  [key in E_Languages]: {
    key: string
    value: string
  }[]
}

export const productFeatures = raw(
  lanEnumToObject([
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    },
  ]),
)

// ==================================

export enum StatusEnum {
  c = 'cancelled',
  d = 'done',
  w = 'waiting',
  p = 'in progress',
}
