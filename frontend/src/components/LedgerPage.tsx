// src/components/LedgerPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { Search, Hash, Calendar, Building, FileText, ExternalLink, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { api, type LedgerTransaction, type TxStatus, type TxType } from './utils/api';

interface LedgerPageProps {
  onNavigate: (page: string) => void;
}

export function LedgerPage({ onNavigate }: LedgerPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | TxType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | TxStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [items, setItems] = useState<LedgerTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / itemsPerPage)), [total]);

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .getLedger({
        search: searchTerm.trim() || undefined,
        type: filterType,
        status: filterStatus,
        page: currentPage,
        limit: itemsPerPage,
      })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setLatestBlock(res.latestBlock);
      })
      .catch((e) => setError(e.message || 'Failed to load ledger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterType, filterStatus, currentPage]);

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const truncateHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1A237E] mb-4">Blockchain Ledger</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent record of all certificate issuances and institutional registrations on the blockchain
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#1A237E] mb-2">{total}</div>
              <div className="text-gray-600">Total Transactions</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#4CAF50] mb-2">
                {items.filter((t) => t.status === 'CONFIRMED').length}
              </div>
              <div className="text-gray-600">Confirmed (this page)</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {items.filter((t) => t.status === 'PENDING').length}
              </div>
              <div className="text-gray-600">Pending (this page)</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#1A237E] mb-2">
                {latestBlock ? latestBlock.toLocaleString() : '-'}
              </div>
              <div className="text-gray-600">Latest Block</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="bg-white shadow-lg border-0 rounded-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by certificate title, institution, hash, or Issuer ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>

              {/* Type Filter */}
              <div className="md:w-64">
                <Select
                  value={filterType}
                  onValueChange={(v) => {
                    setCurrentPage(1);
                    setFilterType(v as 'all' | TxType);
                  }}
                >
                  <SelectTrigger className="border-[#E0E0E0] focus:border-[#1A237E] focus:ring-[#1A237E]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="CERTIFICATE_ISSUED">Certificates</SelectItem>
                    <SelectItem value="INSTITUTION_REGISTERED">Registrations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="md:w-64">
                <Select
                  value={filterStatus}
                  onValueChange={(v) => {
                    setCurrentPage(1);
                    setFilterStatus(v as 'all' | TxStatus);
                  }}
                >
                  <SelectTrigger className="border-[#E0E0E0] focus:border-[#1A237E] focus:ring-[#1A237E]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading / Error */}
        {loading && <p className="text-center text-gray-600">Loading transactions...</p>}
        {error && <p className="text-center text-red-500 mb-6">{error}</p>}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-600">Showing {items.length} of {total} transactions</p>
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-4 mb-8">
          {items.map((transaction) => (
            <Card key={transaction.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        className={`${
                          transaction.transactionType === 'CERTIFICATE_ISSUED'
                            ? 'bg-[#1A237E] text-white'
                            : 'bg-[#4CAF50] text-white'
                        }`}
                      >
                        {transaction.transactionType === 'CERTIFICATE_ISSUED' ? (
                          <FileText className="h-3 w-3 mr-1" />
                        ) : (
                          <Building className="h-3 w-3 mr-1" />
                        )}
                        {transaction.transactionType === 'CERTIFICATE_ISSUED' ? 'Certificate' : 'Registration'}
                      </Badge>

                      <Badge className={transaction.status === 'CONFIRMED' ? 'bg-[#4CAF50] text-white' : 'bg-orange-500 text-white'}>
                        {transaction.status}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-[#1A237E] mb-2">{transaction.certificateTitle}</h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="font-medium">{transaction.issuedBy}</span>
                        <span className="mx-2">•</span>
                        <span className="font-mono text-[#1A237E]">{transaction.issuerId}</span>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(transaction.timestamp)}</span>
                      </div>

                      <div className="flex items-center">
                        <Hash className="h-4 w-4 mr-2" />
                        <span className="font-mono">Block #{transaction.blockNumber.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="lg:text-right">
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Transaction Hash:</div>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded border">{truncateHash(transaction.hash)}</div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
                      onClick={() => navigator.clipboard.writeText(transaction.hash)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Copy Hash
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-12">
            <Hash className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No transactions found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
                setCurrentPage(1);
              }}
              variant="outline"
              className="mt-4 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              variant="outline"
              className="border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            <span className="text-gray-600">Page {currentPage} of {totalPages}</span>

            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              variant="outline"
              className="border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-[#1A237E] rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Experience Blockchain Transparency</h2>
          <p className="text-xl text-blue-200 mb-8">Every certificate is permanently recorded and publicly verifiable</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('verify')} size="lg" className="bg-white text-[#1A237E] hover:bg-gray-100 px-8 py-3">
              Verify a Certificate
            </Button>
            <Button
              onClick={() => onNavigate('register')}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#1A237E] px-8 py-3"
            >
              Join Our Network
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

