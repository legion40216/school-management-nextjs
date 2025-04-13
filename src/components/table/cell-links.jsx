"use client"
import React from 'react'

import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function CellLinks({
    dataId,
    dataLabel,
    paramsName
}) {

  return (
    <Link
    className={buttonVariants({ 
      variant: "link",
      size: "sm" 
    })}
    href={`${paramsName}/${dataId}`}
  >
    {dataLabel}
  </Link>
  )
}
