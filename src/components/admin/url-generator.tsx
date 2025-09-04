'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Copy, Mail, ExternalLink, CheckCircle } from 'lucide-react';
import { AdminGenerateFormData, AdminGenerateRequestSchema } from '@/types/forms';
import { ServiceDefinition } from '@/types';

export function UrlGenerator() {
  const [services, setServices] = useState<ServiceDefinition[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [, setGeneratedToken] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'url' | 'email'>('url');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AdminGenerateFormData>({
    resolver: zodResolver(AdminGenerateRequestSchema),
    defaultValues: {
      expirationDays: 7,
      oneTimeUse: true,
    },
  });

  const clientEmail = watch('clientInfo.email');

  // Load available services
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
      // Fallback to mock data for development
      setServices([
        {
          id: '1',
          name: 'Vapi API',
          description: 'Voice AI platform credentials',
          credentialType: 'api_key',
          fields: [{ name: 'api_key', label: 'API Key', type: 'password', required: true }],
        },
        {
          id: '2',
          name: 'Email Marketing Platform',
          description: 'SMTP configuration for email campaigns',
          credentialType: 'smtp_config',
          fields: [
            { name: 'host', label: 'SMTP Host', type: 'text', required: true },
            { name: 'username', label: 'Username', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ],
        },
        {
          id: '3',
          name: 'CRM Integration',
          description: 'Customer relationship management system access',
          credentialType: 'oauth_json',
          fields: [{ name: 'oauth_json', label: 'OAuth JSON', type: 'json', required: true }],
        },
      ]);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const onSubmit = async (data: AdminGenerateFormData) => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          services: selectedServices,
          deliveryMethod,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedUrl(result.url);
        setGeneratedToken(result.token);
        
        if (deliveryMethod === 'email') {
          setEmailSent(true);
        }
      } else {
        throw new Error('Failed to generate URL');
      }
    } catch (error) {
      console.error('Error generating URL:', error);
      alert('Failed to generate collection URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    reset();
    setSelectedServices([]);
    setGeneratedUrl('');
    setGeneratedToken('');
    setEmailSent(false);
    setCopied(false);
  };

  const selectedServiceNames = services
    .filter(s => selectedServices.includes(s.id))
    .map(s => s.name);

  return (
    <div className="space-y-6">
      {generatedUrl ? (
        /* Success State */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Collection URL Generated Successfully
            </CardTitle>
            <CardDescription>
              {deliveryMethod === 'email' && emailSent
                ? 'Email sent to client with collection link'
                : 'Share this URL with your client to collect their credentials'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deliveryMethod === 'email' && emailSent ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  ✅ Email sent successfully to <strong>{clientEmail}</strong>
                </p>
                <p className="text-sm text-green-700 mt-1">
                  The client will receive a professional email with the collection link and instructions.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Collection URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={generatedUrl} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(generatedUrl, '_blank')}
                    className="shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-gray-500">Client</Label>
                <p className="font-medium">{watch('clientInfo.name')}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Services</Label>
                <p className="font-medium">{selectedServiceNames.join(', ')}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Expires</Label>
                <p className="font-medium">{watch('expirationDays')} days</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">One-time use</Label>
                <p className="font-medium">{watch('oneTimeUse') ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <Button onClick={resetForm} variant="outline" className="w-full">
              Generate Another URL
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Form State */
        <>
          {/* Delivery Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Method</CardTitle>
              <CardDescription>Choose how to share the collection link with your client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    deliveryMethod === 'url' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setDeliveryMethod('url')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      deliveryMethod === 'url' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {deliveryMethod === 'url' && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                    </div>
                    <div>
                      <h3 className="font-medium">Share URL</h3>
                      <p className="text-sm text-gray-500">Generate a link to share manually</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    deliveryMethod === 'email' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setDeliveryMethod('email')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      deliveryMethod === 'email' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {deliveryMethod === 'email' && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                    </div>
                    <div>
                      <h3 className="font-medium">Send Email</h3>
                      <p className="text-sm text-gray-500">Email the link directly to client</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Details about the client who will submit credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Client Name *</Label>
                    <Input
                      id="name"
                      {...register('clientInfo.name')}
                      placeholder="John Smith"
                    />
                    {errors.clientInfo?.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.clientInfo.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('clientInfo.email')}
                      placeholder="john@company.com"
                    />
                    {errors.clientInfo?.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.clientInfo.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      {...register('clientInfo.company')}
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project">Project</Label>
                    <Input
                      id="project"
                      {...register('clientInfo.project')}
                      placeholder="Project Name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Select the services for which credentials are needed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedServices.includes(service.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{service.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {service.credentialType.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {service.fields.length} field{service.fields.length > 1 ? 's' : ''} required
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedServices.length === 0 && (
                  <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    Please select at least one service
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set expiration and usage options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expirationDays">Expiration (days)</Label>
                    <Input
                      id="expirationDays"
                      type="number"
                      min={1}
                      max={30}
                      {...register('expirationDays', { valueAsNumber: true })}
                    />
                    {errors.expirationDays && (
                      <p className="text-sm text-red-600 mt-1">{errors.expirationDays.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      {...register('oneTimeUse')}
                      id="oneTimeUse"
                    />
                    <Label htmlFor="oneTimeUse">One-time use only</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                  <Textarea
                    id="adminNotes"
                    {...register('adminNotes')}
                    placeholder="Internal notes about this request..."
                    className="h-20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || selectedServices.length === 0}
              className="w-full"
              size="lg"
            >
              {loading ? (
                'Generating...'
              ) : deliveryMethod === 'email' ? (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Generate URL & Send Email
                </>
              ) : (
                'Generate Collection URL'
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}