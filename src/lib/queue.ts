import { Client } from '@upstash/qstash'

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!
})

export const enqueueJob = async (jobType: string, data: any) => {
  await qstash.publishJSON({
    url: `https://02f5-183-83-53-173.ngrok-free.app/api/jobs`,
    body: data
  })
}