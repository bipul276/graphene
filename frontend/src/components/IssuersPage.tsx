// src/components/IssuersPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Calendar, Shield, Building2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { api, type Institution } from './utils/api';

interface IssuersPageProps {
  onNavigate: (page: string) => void;
}

export function IssuersPage({ onNavigate }: IssuersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votingFor, setVotingFor] = useState<string | null>(null);

  const totalCertificates = useMemo(
    () => institutions.reduce((sum, inst) => sum + (inst.certificatesIssued || 0), 0),
    [institutions]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api
      .getInstitutions(searchTerm)
      .then((data) => {
        if (!active) return;
        setInstitutions(data);
      })
      .catch((e) => {
        if (!active) return;
        setError(e.message || 'Failed to load institutions');
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [searchTerm]);

  async function handleVote(issuerId: string, vote: 'approve' | 'report') {
    try {
      setVotingFor(issuerId + vote);
      await api.submitInstitutionFeedback(issuerId, vote);
      // Optimistically update local counters
      setInstitutions((prev) =>
        prev.map((inst) => {
          if (inst.issuerId !== issuerId) return inst;
          const approvals = (inst.approvals || 0) + (vote === 'approve' ? 1 : 0);
          const reports = (inst.reports || 0) + (vote === 'report' ? 1 : 0);
          const votes = approvals + reports;
          const approvalRate = votes > 0 ? Number(((approvals / votes) * 100).toFixed(1)) : 0;
          return { ...inst, approvals, reports, approvalRate } as Institution;
        })
      );
    } catch (e: any) {
      setError(e?.message || 'Unable to submit feedback right now');
    } finally {
      setVotingFor(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1A237E] mb-4">Verified Issuing Institutions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our network of blockchain-verified educational institutions and certificate issuers
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by institution name, location, or Issuer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-[#E0E0E0] focus:border-[#1A237E] focus:ring-[#1A237E] rounded-xl"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#1A237E] mb-2">{institutions.length}</div>
              <div className="text-gray-600">Verified Institutions</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#4CAF50] mb-2">{totalCertificates.toLocaleString()}</div>
              <div className="text-gray-600">Certificates Issued</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#1A237E] mb-2">
                {/* simple unique countries count from location suffix after last comma */}
                {
                  new Set(
                    institutions
                      .map((i) => (i.location || '').split(',').pop()?.trim())
                      .filter(Boolean) as string[]
                  ).size || 0
                }
              </div>
              <div className="text-gray-600">Countries</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-center text-gray-600">Loading institutions...</p>}
        {error && <p className="text-center text-red-500 mb-6">{error}</p>}

        {/* Institutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {institutions.map((institution) => (
            <Card
              key={institution.id}
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden"
            >
              {/* Institution Image */}
              <div className="relative h-48 bg-gray-200">
                <ImageWithFallback
                  src={institution.imageUrl}
                  alt={`${institution.name} campus`}
                  className="w-full h-full object-cover"
                />
                {/* Community approval badge */}
                {typeof institution.approvalRate === 'number' && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-[#1A237E] border border-[#1A237E]">
                      {institution.approvalRate}% approval
                    </Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {institution.verified && (
                    <Badge className="bg-[#4CAF50] text-white flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                {/* Institution Name */}
                <h3 className="text-xl font-bold text-[#1A237E] mb-3">{institution.name}</h3>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{institution.location}</span>
                </div>

                {/* Established Date */}
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Established {institution.establishedDate}</span>
                </div>

                {/* Issuer ID */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Issuer ID:</span>
                    <span className="font-mono text-sm text-[#1A237E] font-medium">{institution.issuerId}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#1A237E]">
                      {institution.certificatesIssued.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Certificates</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#4CAF50]">
                      {typeof institution.approvals === 'number' && typeof institution.reports === 'number'
                        ? `${institution.approvals} 👍 · ${institution.reports} ⚠️`
                        : '—'}
                    </div>
                    <div className="text-xs text-gray-600">Community</div>
                  </div>
                </div>
                {/* Vote buttons */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Button
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    disabled={votingFor === institution.issuerId + 'approve'}
                    onClick={() => handleVote(institution.issuerId, 'approve')}
                  >
                    👍 Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    disabled={votingFor === institution.issuerId + 'report'}
                    onClick={() => handleVote(institution.issuerId, 'report')}
                  >
                    ⚠️ Report
                  </Button>
                </div>
                {/* Optional: Last Activity (humanized) */}
                {institution.lastActivity && (
                  <div className="text-xs text-gray-500 mb-4 text-center">Last activity: {new Date(institution.lastActivity).toLocaleString()}</div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => onNavigate('verify')}
                  variant="outline"
                  className="w-full border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify Certificate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {!loading && !error && institutions.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No institutions found</h3>
            <p className="text-gray-500">Try adjusting your search terms or browse all institutions</p>
            <Button
              onClick={() => setSearchTerm('')}
              variant="outline"
              className="mt-4 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
