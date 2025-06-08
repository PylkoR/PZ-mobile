import { createContext, useState,useContext,ReactNode } from "react";
import { DataItem } from "../components/TanStackTable"; // Zaimportuj typ z istniejącego komponentu

// Definicja typów dla naszego kontekstu
interface InventoryContextType {
  inventoryData: DataItem[];
  setInventoryData: (data: DataItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  currentInventoryId: string | null;
  setCurrentInventoryId: (id: string | null) => void;
}

// Tworzymy kontekst z wartościami domyślnymi
const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Tworzymy Provider - komponent, który będzie dostarczał stan
export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventoryData, setInventoryData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentInventoryId, setCurrentInventoryId] = useState<string | null>(null);

  const value = {
    inventoryData,
    setInventoryData,
    isLoading,
    setIsLoading,
    currentInventoryId,
    setCurrentInventoryId,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

// Tworzymy własny hook, aby uprościć korzystanie z kontekstu
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory musi być używane wewnątrz InventoryProvider");
  }
  return context;
};