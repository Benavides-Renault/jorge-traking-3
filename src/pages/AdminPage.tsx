import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  User, 
  PlayCircle, 
  Plus, 
  Search, 
  Download,
  Filter,
  ChevronDown,
  ChevronRight,
  MapPin,
  Calendar,
  Phone,
  Truck,
  X,
  Check,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import AuthGuard from '@/components/AuthGuard';
import DemoTrackingComponent from '@/components/DemoTrackingComponent';
import Map from '@/components/Map';
import { Coordinates } from '@/types';

interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  driverName: string;
  driverPhone: string;
  destination: string;
  details: string;
  comments: string;
  createdAt: Date;
  status: 'en_curso' | 'completado' | 'cancelado';
  startCoordinates: string;
  endCoordinates: string;
  completedAt?: Date;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licensePlate: string;
  vehicleModel: string;
  createdAt: Date;
  status: 'activo' | 'inactivo';
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'drivers' | 'history' | 'demo'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [isCreateDriverModalOpen, setIsCreateDriverModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [isEditDriverModalOpen, setIsEditDriverModalOpen] = useState(false);
  const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);
  const [isDeleteDriverModalOpen, setIsDeleteDriverModalOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [mapSelectionType, setMapSelectionType] = useState<'start' | 'end' | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id' | 'createdAt'>>({
    clientName: '',
    clientPhone: '',
    driverName: '',
    driverPhone: '',
    destination: '',
    details: '',
    comments: '',
    status: 'en_curso',
    startCoordinates: '',
    endCoordinates: '',
  });
  
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    email: '',
    licensePlate: '',
    vehicleModel: '',
    status: 'activo',
  });
  
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  
  // Load initial data
  useEffect(() => {
    loadOrders();
    loadDrivers();
  }, []);
  
  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem('trackingOrders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders) as Order[];
        setOrders(parsedOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Error al cargar las órdenes');
    }
  };
  
  const loadDrivers = () => {
    try {
      const savedDrivers = localStorage.getItem('trackingDrivers');
      if (savedDrivers) {
        const parsedDrivers = JSON.parse(savedDrivers) as Driver[];
        setDrivers(parsedDrivers);
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
      toast.error('Error al cargar los conductores');
    }
  };
  
  const saveOrders = (orders: Order[]) => {
    try {
      localStorage.setItem('trackingOrders', JSON.stringify(orders));
      setOrders(orders);
      toast.success('Órdenes guardadas correctamente');
    } catch (error) {
      console.error('Error saving orders:', error);
      toast.error('Error al guardar las órdenes');
    }
  };
  
  const saveDrivers = (drivers: Driver[]) => {
    try {
      localStorage.setItem('trackingDrivers', JSON.stringify(drivers));
      setDrivers(drivers);
      toast.success('Conductores guardados correctamente');
    } catch (error) {
      console.error('Error saving drivers:', error);
      toast.error('Error al guardar los conductores');
    }
  };
  
  const generateId = (prefix: string): string => {
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `${prefix}${randomNumber}`;
  };
  
  const handleCreateOrder = () => {
    if (
      !newOrder.clientName ||
      !newOrder.clientPhone ||
      !newOrder.driverName ||
      !newOrder.driverPhone ||
      !newOrder.destination ||
      !newOrder.details ||
      !newOrder.startCoordinates ||
      !newOrder.endCoordinates
    ) {
      toast.warning('Por favor, complete todos los campos');
      return;
    }
    
    const newId = generateId('ORD');
    const newOrderWithId: Order = {
      id: newId,
      ...newOrder,
      createdAt: new Date(),
    };
    
    saveOrders([...orders, newOrderWithId]);
    setNewOrder({
      clientName: '',
      clientPhone: '',
      driverName: '',
      driverPhone: '',
      destination: '',
      details: '',
      comments: '',
      status: 'en_curso',
      startCoordinates: '',
      endCoordinates: '',
    });
    
    setIsCreateOrderModalOpen(false);
    toast.success('Orden creada correctamente');
  };
  
  const handleCreateDriver = () => {
    if (
      !newDriver.name ||
      !newDriver.phone ||
      !newDriver.email ||
      !newDriver.licensePlate ||
      !newDriver.vehicleModel
    ) {
      toast.warning('Por favor, complete todos los campos');
      return;
    }
    
    const newId = generateId('DRV');
    const newDriverWithId: Driver = {
      id: newId,
      ...newDriver,
      createdAt: new Date(),
    };
    
    saveDrivers([...drivers, newDriverWithId]);
    setNewDriver({
      name: '',
      phone: '',
      email: '',
      licensePlate: '',
      vehicleModel: '',
      status: 'activo',
    });
    
    setIsCreateDriverModalOpen(false);
    toast.success('Conductor registrado correctamente');
  };
  
  const handleUpdateOrder = () => {
    if (!editOrder) {
      toast.warning('No hay orden para actualizar');
      return;
    }
    
    if (
      !editOrder.clientName ||
      !editOrder.clientPhone ||
      !editOrder.driverName ||
      !editOrder.driverPhone ||
      !editOrder.destination ||
      !editOrder.details ||
      !editOrder.startCoordinates ||
      !editOrder.endCoordinates
    ) {
      toast.warning('Por favor, complete todos los campos');
      return;
    }
    
    const updatedOrders = orders.map((order) =>
      order.id === editOrder.id ? editOrder : order
    );
    saveOrders(updatedOrders);
    setEditOrder(null);
    setIsEditOrderModalOpen(false);
    toast.success('Orden actualizada correctamente');
  };
  
  const handleUpdateDriver = () => {
    if (!editDriver) {
      toast.warning('No hay conductor para actualizar');
      return;
    }
    
    if (
      !editDriver.name ||
      !editDriver.phone ||
      !editDriver.email ||
      !editDriver.licensePlate ||
      !editDriver.vehicleModel
    ) {
      toast.warning('Por favor, complete todos los campos');
      return;
    }
    
    const updatedDrivers = drivers.map((driver) =>
      driver.id === editDriver.id ? editDriver : driver
    );
    saveDrivers(updatedDrivers);
    setEditDriver(null);
    setIsEditDriverModalOpen(false);
    toast.success('Conductor actualizado correctamente');
  };
  
  const handleDeleteOrder = () => {
    if (!selectedOrderId) {
      toast.warning('No hay orden para eliminar');
      return;
    }
    
    const updatedOrders = orders.filter((order) => order.id !== selectedOrderId);
    saveOrders(updatedOrders);
    setSelectedOrderId(null);
    setIsDeleteOrderModalOpen(false);
    toast.success('Orden eliminada correctamente');
  };
  
  const handleDeleteDriver = () => {
    if (!selectedDriverId) {
      toast.warning('No hay conductor para eliminar');
      return;
    }
    
    const updatedDrivers = drivers.filter((driver) => driver.id !== selectedDriverId);
    saveDrivers(updatedDrivers);
    setSelectedDriverId(null);
    setIsDeleteDriverModalOpen(false);
    toast.success('Conductor eliminado correctamente');
  };
  
  const handleLocationSelect = (coordinates: Coordinates, type: 'start' | 'end') => {
    const coordString = `${coordinates.lat},${coordinates.lng}`;
    
    if (isEditOrderModalOpen && editOrder) {
      setEditOrder({
        ...editOrder,
        [type === 'start' ? 'startCoordinates' : 'endCoordinates']: coordString,
      });
    } else {
      setNewOrder({
        ...newOrder,
        [type === 'start' ? 'startCoordinates' : 'endCoordinates']: coordString,
      });
    }
    
    setIsMapDialogOpen(false);
    setMapSelectionType(null);
    toast.success(`Ubicación de ${type === 'start' ? 'origen' : 'destino'} seleccionada`);
  };
  
  const openMapDialog = (type: 'start' | 'end') => {
    setMapSelectionType(type);
    setIsMapDialogOpen(true);
  };
  
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterStatus || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const formatDate = (date: Date): string => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleString();
  };
  
  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'en_curso':
        return 'bg-amber-100 text-amber-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getDriverStatusBadgeColor = (status: Driver['status']) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                <Truck size={20} />
              </div>
              <h1 className="text-2xl font-semibold">Panel Administrativo</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Usuario: Admin
              </div>
              <button className="px-3 py-1.5 rounded-full border text-sm hover:bg-secondary/50 transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              <FileText size={16} />
              <span>Nueva Orden</span>
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === 'drivers' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
              }`}
              onClick={() => setActiveTab('drivers')}
            >
              <User size={16} />
              <span>Gestionar Conductores</span>
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                activeTab === 'demo' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
              }`}
              onClick={() => setActiveTab('demo')}
            >
              <PlayCircle size={16} />
              <span>Demo de Rastreo</span>
            </button>
          </div>
          
          {/* Órdenes Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Gestión de Órdenes</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsCreateOrderModalOpen(true)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                      >
                        <Plus size={16} />
                        <span>Nueva Orden</span>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('history')}
                        className="bg-secondary px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors"
                      >
                        <Download size={16} />
                        <span>Descargar Historial</span>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Administre las órdenes de servicio y supervise el estado de cada entrega.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="text"
                          placeholder="Buscar por ID, cliente, conductor..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div className="w-full sm:w-48">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-no-repeat bg-right"
                          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundPosition: "right 10px center" }}
                        >
                          <option value="">Todos</option>
                          <option value="en_curso">En curso</option>
                          <option value="completado">Completado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                    
                    {filteredOrders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-border">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Conductor</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Destino</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Creado</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                            </tr>
                          </thead>
                          
                          <tbody className="divide-y divide-border">
                            {filteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{order.clientName}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{order.driverName}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{order.destination}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                  {formatDate(order.createdAt)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditOrder(order);
                                        setIsEditOrderModalOpen(true);
                                      }}
                                      className="p-1 rounded-md hover:bg-secondary/80 transition-colors"
                                      title="Editar"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    
                                    <button
                                      onClick={() => {
                                        setSelectedOrderId(order.id);
                                        setIsDeleteOrderModalOpen(true);
                                      }}
                                      className="p-1 rounded-md hover:bg-secondary/80 transition-colors"
                                      title="Eliminar"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center border rounded-lg bg-secondary/10">
                        <p className="text-muted-foreground">No hay órdenes que coincidan con los filtros.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Conductores Tab */}
          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Gestión de Conductores</h2>
                    <button
                      onClick={() => setIsCreateDriverModalOpen(true)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Nuevo Conductor</span>
                    </button>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Administre los conductores disponibles para realizar entregas.
                  </p>
                  
                  <div className="overflow-x-auto">
                    {drivers.length > 0 ? (
                      <table className="w-full divide-y divide-border">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Teléfono</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Placa</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Vehículo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-border">
                          {drivers.map((driver) => (
                            <tr key={driver.id} className="hover:bg-secondary/20 transition-colors">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{driver.id}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{driver.name}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{driver.phone}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{driver.email}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{driver.licensePlate}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">{driver.vehicleModel}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${getDriverStatusBadgeColor(driver.status)}`}>
                                  {driver.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditDriver(driver);
                                      setIsEditDriverModalOpen(true);
                                    }}
                                    className="p-1 rounded-md hover:bg-secondary/80 transition-colors"
                                    title="Editar"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  
                                  <button
                                    onClick={() => {
                                      setSelectedDriverId(driver.id);
                                      setIsDeleteDriverModalOpen(true);
                                    }}
                                    className="p-1 rounded-md hover:bg-secondary/80 transition-colors"
                                    title="Eliminar"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center border rounded-lg bg-secondary/10">
                        <p className="text-muted-foreground">No hay conductores registrados.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Historial Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Historial de Órdenes</h2>
                    <button
                      className="bg-secondary px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors"
                    >
                      <Download size={16} />
                      <span>Descargar Historial</span>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="text"
                          placeholder="Buscar por ID, cliente, conductor..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div className="w-full sm:w-48">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-no-repeat bg-right"
                          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundPosition: "right 10px center" }}
                        >
                          <option value="">Todos</option>
                          <option value="en_curso">En curso</option>
                          <option value="completado">Completado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="px-3 py-2 rounded-md text-sm border hover:bg-secondary/50 transition-colors">
                          Día
                        </button>
                        <button className="px-3 py-2 rounded-md text-sm border hover:bg-secondary/50 transition-colors">
                          Semana
                        </button>
                        <button className="px-3 py-2 rounded-md text-sm border hover:bg-secondary/50 transition-colors">
                          Mes
                        </button>
                      </div>
                    </div>
                    
                    {filteredOrders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-border">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Conductor</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Destino</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Creado</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                            </tr>
                          </thead>
                          
                          <tbody className="divide-y divide-border">
                            {filteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{order.clientName}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{order.driverName}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{order.destination}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                  {formatDate(order.createdAt)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditOrder(order);
                                        setIsEditOrderModalOpen(true);
                                      }}
                                      className="p-1 rounded-md hover:bg-secondary/80 transition-colors"
                                      title="Editar"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    
                                    <button
                                      onClick={() => {
                                        setSelectedOrderId(order.id);
                                        setIsDeleteOrderModalOpen(true);
                                      }}
                                      className="p-1 rounded-md hover:bg-secondary/80 transition-colors"
                                      title="Eliminar"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center border rounded-lg bg-secondary/10">
                        <p className="text-muted-foreground">No hay órdenes que coincidan con los filtros.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Demo Tab */}
          {activeTab === 'demo' && (
            <DemoTrackingComponent />
          )}
        </div>
      </div>
      
      {/* Create Order Modal */}
      {isCreateOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Nueva Orden</h2>
              <button onClick={() => setIsCreateOrderModalOpen(false)} className="p-1 rounded-full hover:bg-secondary/80">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Cliente</label>
                    <input
                      type="text"
                      value={newOrder.clientName}
                      onChange={(e) => setNewOrder({...newOrder, clientName: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono del Cliente</label>
                    <input
                      type="text"
                      value={newOrder.clientPhone}
                      onChange={(e) => setNewOrder({...newOrder, clientPhone: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Conductor</label>
                    <input
                      type="text"
                      value={newOrder.driverName}
                      onChange={(e) => setNewOrder({...newOrder, driverName: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono del Conductor</label>
                    <input
                      type="text"
                      value={newOrder.driverPhone}
                      onChange={(e) => setNewOrder({...newOrder, driverPhone: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Destino</label>
                    <input
                      type="text"
                      value={newOrder.destination}
                      onChange={(e) => setNewOrder({...newOrder, destination: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Detalles</label>
                    <textarea
                      value={newOrder.details}
                      onChange={(e) => setNewOrder({...newOrder, details: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                      rows={2}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Comentarios</label>
                    <textarea
                      value={newOrder.comments}
                      onChange={(e) => setNewOrder({...newOrder, comments: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                      rows={2}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      value={newOrder.status}
                      onChange={(e) => setNewOrder({...newOrder, status: e.target.value as Order['status']})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="en_curso">En curso</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coordenadas de Inicio</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOrder.startCoordinates}
                      readOnly
                      className="w-full px-3 py-2 rounded-md border bg-secondary/20"
                    />
                    <button
                      onClick={() => openMapDialog('start')}
                      className="px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-sm font-medium flex items-center gap-1"
                    >
                      <MapPin size={16} />
                      Seleccionar
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Coordenadas de Fin</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOrder.endCoordinates}
                      readOnly
                      className="w-full px-3 py-2 rounded-md border bg-secondary/20"
                    />
                    <button
                      onClick={() => openMapDialog('end')}
                      className="px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-sm font-medium flex items-center gap-1"
                    >
                      <MapPin size={16} />
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button 
                onClick={() => setIsCreateOrderModalOpen(false)}
                className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleCreateOrder}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Crear Orden
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Order Modal */}
      {isEditOrderModalOpen && editOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Editar Orden - {editOrder.id}</h2>
              <button onClick={() => {
                setIsEditOrderModalOpen(false);
                setEditOrder(null);
              }} className="p-1 rounded-full hover:bg-secondary/80">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Cliente</label>
                    <input
                      type="text"
                      value={editOrder.clientName}
                      onChange={(e) => setEditOrder({...editOrder, clientName: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono del Cliente</label>
                    <input
                      type="text"
                      value={editOrder.clientPhone}
                      onChange={(e) => setEditOrder({...editOrder, clientPhone: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Conductor</label>
                    <input
                      type="text"
                      value={editOrder.driverName}
                      onChange={(e) => setEditOrder({...editOrder, driverName: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono del Conductor</label>
                    <input
                      type="text"
                      value={editOrder.driverPhone}
                      onChange={(e) => setEditOrder({...editOrder, driverPhone: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Destino</label>
                    <input
                      type="text"
                      value={editOrder.destination}
                      onChange={(e) => setEditOrder({...editOrder, destination: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Detalles</label>
                    <textarea
                      value={editOrder.details}
                      onChange={(e) => setEditOrder({...editOrder, details: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                      rows={2}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Comentarios</label>
                    <textarea
                      value={editOrder.comments}
                      onChange={(e) => setEditOrder({...editOrder, comments: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                      rows={2}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      value={editOrder.status}
                      onChange={(e) => setEditOrder({...editOrder, status: e.target.value as Order['status']})}
                      className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="en_curso">En curso</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coordenadas de Inicio</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editOrder.startCoordinates}
                      readOnly
                      className="w-full px-3 py-2 rounded-md border bg-secondary/20"
                    />
                    <button
                      onClick={() => openMapDialog('start')}
                      className="px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-sm font-medium flex items-center gap-1"
                    >
                      <MapPin size={16} />
                      Seleccionar
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Coordenadas de Fin</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editOrder.endCoordinates}
                      readOnly
                      className="w-full px-3 py-2 rounded-md border bg-secondary/20"
                    />
                    <button
                      onClick={() => openMapDialog('end')}
                      className="px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-sm font-medium flex items-center gap-1"
                    >
                      <MapPin size={16} />
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button 
                onClick={() => {
                  setIsEditOrderModalOpen(false);
                  setEditOrder(null);
                }}
                className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleUpdateOrder}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Driver Modal */}
      {isCreateDriverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Nuevo Conductor</h2>
              <button onClick={() => setIsCreateDriverModalOpen(false)} className="p-1 rounded-full hover:bg-secondary/80">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Placa del Vehículo</label>
                  <input
                    type="text"
                    value={newDriver.licensePlate}
                    onChange={(e) => setNewDriver({...newDriver, licensePlate: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Modelo del Vehículo</label>
                  <input
                    type="text"
                    value={newDriver.vehicleModel}
                    onChange={(e) => setNewDriver({...newDriver, vehicleModel: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    value={newDriver.status}
                    onChange={(e) => setNewDriver({...newDriver, status: e.target.value as Driver['status']})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button 
                onClick={() => setIsCreateDriverModalOpen(false)}
                className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleCreateDriver}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Registrar Conductor
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Driver Modal */}
      {isEditDriverModalOpen && editDriver && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Editar Conductor - {editDriver.id}</h2>
              <button onClick={() => {
                setIsEditDriverModalOpen(false);
                setEditDriver(null);
              }} className="p-1 rounded-full hover:bg-secondary/80">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={editDriver.name}
                    onChange={(e) => setEditDriver({...editDriver, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={editDriver.phone}
                    onChange={(e) => setEditDriver({...editDriver, phone: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editDriver.email}
                    onChange={(e) => setEditDriver({...editDriver, email: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Placa del Vehículo</label>
                  <input
                    type="text"
                    value={editDriver.licensePlate}
                    onChange={(e) => setEditDriver({...editDriver, licensePlate: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Modelo del Vehículo</label>
                  <input
                    type="text"
                    value={editDriver.vehicleModel}
                    onChange={(e) => setEditDriver({...editDriver, vehicleModel: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    value={editDriver.status}
                    onChange={(e) => setEditDriver({...editDriver, status: e.target.value as Driver['status']})}
                    className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button 
                onClick={() => {
                  setIsEditDriverModalOpen(false);
                  setEditDriver(null);
                }}
                className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleUpdateDriver}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Order Confirmation Modal */}
      {isDeleteOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
              <p className="text-muted-foreground mb-4">
                ¿Está seguro de que desea eliminar esta orden? Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsDeleteOrderModalOpen(false)}
                  className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  Cancelar
                </button>
                
                <button 
                  onClick={handleDeleteOrder}
                  className="px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Driver Confirmation Modal */}
      {isDeleteDriverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
              <p className="text-muted-foreground mb-4">
                ¿Está seguro de que desea eliminar este conductor? Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsDeleteDriverModalOpen(false)}
                  className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  Cancelar
                </button>
                
                <button 
                  onClick={handleDeleteDriver}
                  className="px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Map Selection Dialog */}
      {isMapDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                Seleccionar ubicación {mapSelectionType === 'start' ? 'de origen' : 'de destino'}
              </h2>
              <button onClick={() => {
                setIsMapDialogOpen(false);
                setMapSelectionType(null);
              }} className="p-1 rounded-full hover:bg-secondary/80">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 h-[600px]">
              <Map
                selectionMode={mapSelectionType}
                onLocationSelect={handleLocationSelect}
                centerCoordinates={{ lat: 9.7489, lng: -83.7534 }} // Costa Rica center
              />
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button 
                onClick={() => {
                  setIsMapDialogOpen(false);
                  setMapSelectionType(null);
                }}
                className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
};

export default AdminPage;
