import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import {
  ArrowLeft,
  BedDoubleIcon,
  Check,
  CircleDollarSign,
  HandCoins,
  Truck,
} from "lucide-react-native";
import { fetchOrders, fetchDrivers } from "~/lib/supabase";
import { useEffect } from "react";
import { H3, H4, P } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";

const drivers = ["Driver A", "Driver B", "Driver C"];

export default function DispatcherManagerScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [sortBy, setSortBy] = useState("all-orders");
  const [availableDrivers, setAvailableDrivers] = useState([])

  useEffect(() => {
    async function fetchCustomerOrders() {
      const response = await fetchOrders();
      // console.log("Orders Fetched", response);
      setOrders(response);
    }
    async function fetchAvailableDrivers() {
      const response = await fetchDrivers();
      console.log("Available Drivers", response);
      setAvailableDrivers(response)
    }
    fetchCustomerOrders();
    fetchAvailableDrivers()
  }, []);

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center p-4 pt-14 bg-zinc-900">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <P className="ml-auto mr-auto">Dispatch Manager</P>
        <View style={styles.placeholder} />
      </View>

      <View className="p-4 divide-y-4 flex gap-4">
        <ScrollView horizontal={true}>
          <View className="flex-row py-4 gap-2">
            {["all-orders", "dispatched", "pending", "assigned"].map((sort) => (
              <Button
                key={sort}
                onPress={() => setSortBy(sort)}
                className={`${sortBy === sort ? "bg-white" : " bg-zinc-900"}`}
              >
                <P
                  className={`capitalize ${
                    sortBy === sort ? "bg-white text-black" : " bg-zinc-900"
                  }`}
                >
                  {sort.replace("-", " ")}
                </P>
              </Button>
            ))}
          </View>
        </ScrollView>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }) => (
            <View
              className="flex rounded-lg border-[1px] border-zinc-800"
              key={item.id}
            >
              <Image
                source={{
                  uri: item.products.image_url,
                }}
                className="w-full h-24 rounded-t-lg"
              />
              <View className="p-2">
                <H3 className="text-xl">{item.products.name}</H3>
                <P className="capitalize">{item.payment_status}</P>
              </View>
              <View
                style={{
                  borderBottomColor: "#bac4c8",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  padding: 2,
                }}
              />
              {item.assignedTo && <P>Assigned to: {item.assignedTo}</P>}
              {item.payment_status === "completed" && (
                <View className="p-2">
                  <H4 className='text-base'>Assign to Driver</H4>
                  <ScrollView horizontal={true}>
                    <View className="flex-row py-4 gap-2">
                      {drivers.map((driver) => (
                        <Button
                          key={driver}
                          variant={'outline'}
                          className='flex-row'
                          onPress={() => assignDriver(item.id, driver)}
                        >
                          <Truck size={16} color="#fff" />
                          <P>{driver}</P>
                        </Button>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 14,
    color: '#48BB78',
    fontWeight: '500',
  },
  assignSection: {
    marginTop: 12,
  },
  assignTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  driverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4299E1',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  driverButtonText: {
    color: '#fff',
    marginLeft: 8,
  },
});

