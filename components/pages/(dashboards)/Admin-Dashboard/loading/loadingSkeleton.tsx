import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function LoadingSkeleton() {
  return (
     <div className="rounded-md border border-border bg-background mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <th key={i} className="px-4 py-3 text-left">
                        <Skeleton className="h-4 w-[70%] bg-muted" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border">
                      {Array.from({ length: 6 }).map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-3">
                          <Skeleton className="h-4 w-[70%] bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  )
}

export default LoadingSkeleton