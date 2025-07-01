
"use client";

import Link from 'next/link';
import React from 'react';
import dynamic from 'next/dynamic';

import { Button } from "@/components/ui/button";
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton component for the form loading state
function FormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

// Dynamically import the form logic component
const DynamicNewIncidentForm = dynamic(
  () => import('@/components/citizen/new-incident-form-logic'),
  { 
    ssr: false,
    loading: () => <FormSkeleton /> 
  }
);

export default function NewIncidentReportPage() {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen/incidents">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <PageTitle title="Registrar Nova Denúncia" icon={AlertTriangle} className="mb-0 flex-grow" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Denúncia</CardTitle>
          <CardDescription>Descreva a situação que você gostaria de denunciar. Sua colaboração é importante.</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicNewIncidentForm />
        </CardContent>
      </Card>
    </>
  );
}
