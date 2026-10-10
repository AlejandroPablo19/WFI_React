import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export function InventoryView(){
    const [items, setItems] = useState();

    return(
        <View style ={styles.container}>
            <Text>Inventario</Text>
            <FlatList
            data = {items}
            renderItem ={({item}) =>} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center: { 
    alignItems: "center", 
    flex: 1, 
    justifyContent: "center", 
    padding: 24 
    },

    container: { 
    backgroundColor: "#F3F8F7", 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 20 
	},
})