import { useState } from 'react';
import { ArrowLeft, Search, Car, User, AlertTriangle, MapPin, Calendar, DollarSign, History } from 'lucide-react';
import { AutomotiveButton } from '@/components/ui/automotive-button';
import { AutomotiveCard, AutomotiveCardContent, AutomotiveCardDescription, AutomotiveCardHeader, AutomotiveCardTitle } from '@/components/ui/automotive-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { sampleCars, getCarOwner, getCarCrimeHistory, getOwnershipHistory } from '@/data/sampleData';
import { Car as CarType } from '@/types/database';

const ViewerInterface = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'with-crimes' | 'clean'>('all');

  const filteredCars = sampleCars.filter(car => {
    const matchesSearch = 
      car.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.color.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const crimeHistory = getCarCrimeHistory(car.id);
    
    switch (selectedFilter) {
      case 'with-crimes':
        return crimeHistory.length > 0;
      case 'clean':
        return crimeHistory.length === 0;
      default:
        return true;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-crime-alert text-white';
      case 'medium':
        return 'bg-automotive-accent text-black';
      case 'low':
        return 'bg-success text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const CarDetailDialog = ({ car }: { car: CarType }) => {
    const owner = getCarOwner(car.id);
    const crimeHistory = getCarCrimeHistory(car.id);
    const ownershipHistory = getOwnershipHistory(car.id);

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{car.model} Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Car Image and Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img 
                src={car.image} 
                alt={car.model}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Vehicle Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registration Number:</span>
                    <span className="font-medium">{car.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-medium">{car.yearOfRegistration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span className="font-medium">{car.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Value:</span>
                    <span className="font-bold text-primary">{formatCurrency(car.amount)}</span>
                  </div>
                </div>
              </div>
              
              {owner && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Current Owner
                  </h3>
                  <AutomotiveCard variant="automotive" padding="sm">
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{owner.name}</p>
                      <p className="text-muted-foreground">{owner.address}</p>
                      <p className="text-muted-foreground">{owner.city}, {owner.state} - {owner.pin}</p>
                    </div>
                  </AutomotiveCard>
                </div>
              )}
            </div>
          </div>

          {/* Crime History */}
          {crimeHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-crime-alert" />
                Crime History ({crimeHistory.length} Record{crimeHistory.length > 1 ? 's' : ''})
              </h3>
              <div className="space-y-3">
                {crimeHistory.map((crime) => (
                  <AutomotiveCard key={crime.id} variant="danger" padding="sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{crime.typeOfCrime}</h4>
                        <p className="text-sm text-muted-foreground">CID: {crime.cid}</p>
                      </div>
                      <Badge className={getSeverityColor(crime.severity)}>
                        {crime.severity}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {crime.dateRecorded.toLocaleDateString()}
                      </div>
                      {crime.damage && (
                        <p className="text-muted-foreground">Damage: {crime.damage}</p>
                      )}
                    </div>
                  </AutomotiveCard>
                ))}
              </div>
            </div>
          )}

          {/* Ownership History */}
          {ownershipHistory.length > 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <History className="h-5 w-5" />
                Ownership History
              </h3>
              <div className="space-y-3">
                {ownershipHistory.map((ownership, index) => (
                  <AutomotiveCard key={ownership.id} variant="interactive" padding="sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{ownership.owner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {ownership.owner.city}, {ownership.owner.state}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">
                          {ownership.startDate.toLocaleDateString()} - {
                            ownership.endDate ? ownership.endDate.toLocaleDateString() : 'Present'
                          }
                        </p>
                        {index === 0 && (
                          <Badge className="mt-1 bg-success text-white">Current</Badge>
                        )}
                      </div>
                    </div>
                  </AutomotiveCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AutomotiveButton 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </AutomotiveButton>
              <div>
                <h1 className="text-2xl font-bold">Car Database Viewer</h1>
                <p className="text-sm text-muted-foreground">Browse comprehensive car records and history</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search cars by registration number, model, or color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base py-3"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All Cars', count: sampleCars.length },
              { key: 'with-crimes', label: 'With Crime History', count: sampleCars.filter(car => getCarCrimeHistory(car.id).length > 0).length },
              { key: 'clean', label: 'Clean Records', count: sampleCars.filter(car => getCarCrimeHistory(car.id).length === 0).length }
            ].map(({ key, label, count }) => (
              <AutomotiveButton
                key={key}
                variant={selectedFilter === key ? 'viewer' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(key as any)}
              >
                {label} ({count})
              </AutomotiveButton>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 animate-fade-in">
          <p className="text-muted-foreground">
            Showing {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} 
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {filteredCars.map((car) => {
            const owner = getCarOwner(car.id);
            const crimeHistory = getCarCrimeHistory(car.id);
            const hasCrimes = crimeHistory.length > 0;

            return (
              <AutomotiveCard key={car.id} variant="interactive" className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={car.image} 
                    alt={car.model}
                    className="w-full h-48 object-cover"
                  />
                  {hasCrimes ? (
                    <Badge className="absolute top-3 right-3 bg-crime-alert text-white">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {crimeHistory.length} Record{crimeHistory.length > 1 ? 's' : ''}
                    </Badge>
                  ) : (
                    <Badge className="absolute top-3 right-3 bg-success text-white">
                      Clean Record
                    </Badge>
                  )}
                </div>
                
                <AutomotiveCardHeader className="p-4">
                  <AutomotiveCardTitle className="text-lg flex items-center justify-between">
                    {car.model}
                    <span className="text-sm font-normal text-muted-foreground">{car.yearOfRegistration}</span>
                  </AutomotiveCardTitle>
                  <AutomotiveCardDescription>
                    {car.registrationNumber} • {car.color}
                  </AutomotiveCardDescription>
                </AutomotiveCardHeader>

                <AutomotiveCardContent className="px-4 pb-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Market Value
                    </span>
                    <span className="font-semibold text-primary">{formatCurrency(car.amount)}</span>
                  </div>
                  
                  {owner && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Owner
                      </span>
                      <span className="font-medium">{owner.name}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </span>
                    <span className="font-medium">{owner?.city || 'N/A'}</span>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <AutomotiveButton variant="viewer" className="w-full mt-4">
                        <Search className="h-4 w-4" />
                        View Full Details
                      </AutomotiveButton>
                    </DialogTrigger>
                    <CarDetailDialog car={car} />
                  </Dialog>
                </AutomotiveCardContent>
              </AutomotiveCard>
            );
          })}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cars found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more results.
            </p>
          </div>
        )}

        {/* Statistics Footer */}
        <div className="mt-12 pt-8 border-t animate-fade-in">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{sampleCars.length}</p>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-crime-alert">
                {sampleCars.filter(car => getCarCrimeHistory(car.id).length > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">With Crime History</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">
                {sampleCars.filter(car => getCarCrimeHistory(car.id).length === 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Clean Records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerInterface;