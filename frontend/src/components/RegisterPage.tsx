// src/components/RegisterPage.tsx
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, XCircle, Upload } from 'lucide-react';
import { registerInstitution, type RegisterRequest, type RegisterResponse } from './utils/api';
import { Progress } from './ui/progress';
import { uploadLogoViaBackend } from './utils/uploader';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [form, setForm] = useState({
    institutionName: '',
    address: '',
    city: '',
    stateProvince: '',
    contactName: '',
    email: '',
    password: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploadPct, setLogoUploadPct] = useState<number>(0);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  async function detectLocation() {
    try {
      if (!navigator.geolocation) {
        setServerMsg({ type: 'error', text: 'Geolocation is not supported by this browser.' });
        return;
      }
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const { latitude, longitude } = pos.coords;
              // Try OpenStreetMap reverse geocoding; not critical if it fails
              const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
              const res = await fetch(url, { headers: { 'Accept': 'application/json' } }).catch(() => null as any);
              if (res && res.ok) {
                const data = await res.json();
                const addr = data?.address || {};
                const city = addr.city || addr.town || addr.village || '';
                const state = addr.state || addr.region || '';
                const line = data?.display_name?.split(',')?.slice(0, 3)?.join(', ') || '';
                setForm((prev) => ({ ...prev, address: line, city, stateProvince: state }));
              } else {
                setForm((prev) => ({ ...prev, address: `Lat ${latitude.toFixed(5)}, Lon ${longitude.toFixed(5)}`, city: '', stateProvince: '' }));
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    } catch (e: any) {
      setServerMsg({ type: 'error', text: 'Unable to auto-detect location. You can proceed without it.' });
    }
  }

  const onChange = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  async function uploadLogoIfAny(): Promise<{ logoUrl?: string | null; logoStoragePath?: string | null }> {
    if (!logoFile) return {};
    setIsUploadingLogo(true);
    setLogoUploadPct(0);
    try {
      // Always upload via backend (server-side Firebase Admin)
      const resp = await uploadLogoViaBackend(logoFile);
      setLogoUploadPct(100);
      return resp;
    } catch (e: any) {
      // surface to console for debugging
      // eslint-disable-next-line no-console
      console.error('Logo upload failed:', e);
      // proceed without logo instead of blocking registration
      setServerMsg({ type: 'error', text: e?.message || 'Logo upload failed; continuing without logo.' });
      return {};
    } finally {
      setIsUploadingLogo(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerMsg(null);
    setIsSubmitting(true);

    try {
      const branding = await uploadLogoIfAny();

      const payload: RegisterRequest = {
        ...form,
        ...branding,
      };

      const resp: RegisterResponse = await registerInstitution(payload);

      if (resp.alreadyExisted) {
        setServerMsg({
          type: 'success',
          text: `This email is already registered as ${resp.institutionName || 'an institution'} (Issuer: ${resp.issuerId}). Please log in.`,
        });
      } else {
        setServerMsg({
          type: 'success',
          text: `Registered successfully (Issuer: ${resp.issuerId}). You can now log in.`,
        });
      }

      // Navigate to login after a short delay so user can read the message
      setTimeout(() => onNavigate('login'), 800);
    } catch (err: any) {
      setServerMsg({ type: 'error', text: err?.message || 'Registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-xl rounded-2xl border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-[#1A237E] text-center">
              Register Institution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input id="institutionName" value={form.institutionName} onChange={(e) => onChange('institutionName', e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address (auto)</Label>
                  <Input id="address" value={form.address} readOnly placeholder="Use Detect Location" required />
                </div>
                <div>
                  <Label htmlFor="city">City (auto)</Label>
                  <Input id="city" value={form.city} readOnly placeholder="Use Detect Location" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stateProvince">State / Province (auto)</Label>
                  <Input id="stateProvince" value={form.stateProvince} readOnly placeholder="Use Detect Location" required />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input id="contactName" value={form.contactName} onChange={(e) => onChange('contactName', e.target.value)} required />
                </div>
              </div>

              <div className="flex items-center justify-end -mt-2">
                <Button type="button" variant="outline" className="text-xs h-8" onClick={detectLocation}>
                  Detect Location
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} required />
                </div>
              </div>

              {/* Optional Logo */}
              <div>
                <Label className="flex items-center mb-2">
                  <Upload className="h-4 w-4 mr-2 text-[#1A237E]" />
                  Institution Logo (optional)
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                {logoFile && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">Selected: {logoFile.name}</p>
                    {isUploadingLogo && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Uploading logo…</span>
                          <span>{Math.round(logoUploadPct)}%</span>
                        </div>
                        <Progress value={logoUploadPct} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {serverMsg && (
                <Alert className={serverMsg.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
                  {serverMsg.type === 'error' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  <AlertDescription className="ml-2">{serverMsg.text}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onNavigate('home')}
                  disabled={isSubmitting || isUploadingLogo}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1A237E] hover:bg-[#0D47A1] text-white"
                  disabled={isSubmitting || isUploadingLogo}
                >
                  {isSubmitting ? (isUploadingLogo ? 'Uploading logo…' : 'Registering...') : 'Register'}
                </Button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-sm text-[#1A237E] underline"
                >
                  Already have an account? Log in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

