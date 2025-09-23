import { useState } from 'react';
import { ArrowLeft, Plus, Search, Car, Users, AlertTriangle, Building2, Activity, Eye, Edit, Trash2 } from 'lucide-react';
import { AutomotiveButton } from '@/components/ui/automotive-button';
import { AutomotiveCard, AutomotiveCardContent, AutomotiveCardDescription, AutomotiveCardHeader, AutomotiveCardTitle } from '@/components/ui/automotive-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { sampleCars, sampleOwners, sampleDashboardStats, getCarOwner, getCarCrimeHistory } from '@/data/sampleData';
import { Car as CarType } from '@/types/database';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'cars' | 'owners' | 'crimes'>('overview');

  const filteredCars = sampleCars.filter(car => 
    car.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const renderCarCard = (car: CarType) => {
    const owner = getCarOwner(car.id);
    const crimeHistory = getCarCrimeHistory(car.id);
    const hasCrimes = crimeHistory.length > 0;
    
    return (
      <AutomotiveCard key={car.id} variant="automotive" className="overflow-hidden">
        <div className="relative">
          <img 
            src={car.image} 
            alt={car.model}
            className="w-full h-48 object-cover"
          />
          {hasCrimes && (
            <Badge className="absolute top-3 right-3 bg-crime-alert text-white">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {crimeHistory.length} Crime{crimeHistory.length > 1 ? 's' : ''}
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
            <span className="text-sm text-muted-foreground">Value</span>
            <span className="font-semibold text-primary">{formatCurrency(car.amount)}</span>
          </div>
          
          {owner && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Owner</span>
              <span className="font-medium">{owner.name}</span>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <AutomotiveButton size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4" />
              View
            </AutomotiveButton>
            <AutomotiveButton size="sm" variant="outline" className="flex-1">
              <Edit className="h-4 w-4" />
              Edit
            </AutomotiveButton>
            <AutomotiveButton size="sm" variant="danger" className="px-3">
              <Trash2 className="h-4 w-4" />
            </AutomotiveButton>
          </div>
        </AutomotiveCardContent>
      </AutomotiveCard>
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
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage cars, owners, and crime records</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AutomotiveButton variant="admin">
                <Plus className="h-4 w-4" />
                Add New Car
              </AutomotiveButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 bg-muted/50 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'cars', label: 'Cars', icon: Car },
            { id: 'owners', label: 'Owners', icon: Users },
            { id: 'crimes', label: 'Crime Records', icon: AlertTriangle }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
                selectedTab === id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AutomotiveCard variant="elevated" padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sampleDashboardStats.totalCars}</p>
                    <p className="text-sm text-muted-foreground">Total Cars</p>
                  </div>
                </div>
              </AutomotiveCard>

              <AutomotiveCard variant="elevated" padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-automotive-dark/10">
                    <Users className="h-6 w-6 text-automotive-dark" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sampleDashboardStats.totalOwners}</p>
                    <p className="text-sm text-muted-foreground">Owners</p>
                  </div>
                </div>
              </AutomotiveCard>

              <AutomotiveCard variant="danger" padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-crime-alert/10">
                    <AlertTriangle className="h-6 w-6 text-crime-alert" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sampleDashboardStats.totalCrimes}</p>
                    <p className="text-sm text-muted-foreground">Crime Records</p>
                  </div>
                </div>
              </AutomotiveCard>

              <AutomotiveCard variant="elevated" padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Building2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sampleDashboardStats.totalDealerships}</p>
                    <p className="text-sm text-muted-foreground">Dealerships</p>
                  </div>
                </div>
              </AutomotiveCard>
            </div>

            {/* Recent Activities */}
            <AutomotiveCard variant="elevated">
              <AutomotiveCardHeader>
                <AutomotiveCardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </AutomotiveCardTitle>
              </AutomotiveCardHeader>
              <AutomotiveCardContent className="space-y-3">
                {sampleDashboardStats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className={`p-2 rounded-full ${
                      activity.severity === 'warning' ? 'bg-automotive-accent/20' :
                      activity.severity === 'danger' ? 'bg-crime-alert/20' : 'bg-primary/20'
                    }`}>
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </AutomotiveCardContent>
            </AutomotiveCard>
          </div>
        )}

        {/* Cars Tab */}
        {selectedTab === 'cars' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search cars by registration, model, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <AutomotiveButton variant="admin">
                <Plus className="h-4 w-4" />
                Add Car
              </AutomotiveButton>
            </div>

            {/* Cars Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map(renderCarCard)}
            </div>
          </div>
        )}

        {/* Owners Tab */}
        {selectedTab === 'owners' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Owner Management</h2>
              <AutomotiveButton variant="admin">
                <Plus className="h-4 w-4" />
                Add Owner
              </AutomotiveButton>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleOwners.map((owner) => (
                <AutomotiveCard key={owner.id} variant="interactive">
                  <AutomotiveCardHeader>
                    <AutomotiveCardTitle>{owner.name}</AutomotiveCardTitle>
                    <AutomotiveCardDescription>
                      {owner.city}, {owner.state} - {owner.pin}
                    </AutomotiveCardDescription>
                  </AutomotiveCardHeader>
                  <AutomotiveCardContent>
                    <p className="text-sm text-muted-foreground mb-3">{owner.address}</p>
                    <div className="flex gap-2">
                      <AutomotiveButton size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4" />
                        View
                      </AutomotiveButton>
                      <AutomotiveButton size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4" />
                        Edit
                      </AutomotiveButton>
                    </div>
                  </AutomotiveCardContent>
                </AutomotiveCard>
              ))}
            </div>
          </div>
        )}

        {/* Crimes Tab */}
        {selectedTab === 'crimes' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Crime Records</h2>
              <AutomotiveButton variant="danger">
                <Plus className="h-4 w-4" />
                Report Crime
              </AutomotiveButton>
            </div>

            <div className="space-y-4">
              {sampleCars.map((car) => {
                const crimes = getCarCrimeHistory(car.id);
                if (crimes.length === 0) return null;

                return (
                  <AutomotiveCard key={car.id} variant="danger">
                    <AutomotiveCardHeader>
                      <div className="flex items-center justify-between">
                        <AutomotiveCardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-crime-alert" />
                          {car.model} ({car.registrationNumber})
                        </AutomotiveCardTitle>
                        <Badge className="bg-crime-alert text-white">
                          {crimes.length} Record{crimes.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </AutomotiveCardHeader>
                    <AutomotiveCardContent className="space-y-3">
                      {crimes.map((crime) => (
                        <div key={crime.id} className="p-3 rounded-lg bg-muted/30 border border-crime-alert/20">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{crime.typeOfCrime}</h4>
                            <Badge className={getSeverityColor(crime.severity)}>
                              {crime.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">CID: {crime.cid}</p>
                          <p className="text-sm text-muted-foreground">
                            Date: {crime.dateRecorded.toLocaleDateString()}
                          </p>
                          {crime.damage && (
                            <p className="text-sm text-muted-foreground">Damage: {crime.damage}</p>
                          )}
                        </div>
                      ))}
                    </AutomotiveCardContent>
                  </AutomotiveCard>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;