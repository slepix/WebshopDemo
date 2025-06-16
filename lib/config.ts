'use server'

import { connection } from "next/server";

let apiConfig: { apiUrl: string, timeout: number } | null = null;

export async function getApiConfig(){
  if (!apiConfig) {
    await connection()
    apiConfig = {
      apiUrl: process.env.API_URL || '',
      timeout: 8000, // 8 seconds
    };
  }
  return apiConfig;
}
