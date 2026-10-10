import { StyleSheet, View } from "react-native";

export function  AddFruit () {
    return (
        <View style ={styles.card}>

        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderColor: "#D7E4E8",
		borderRadius: 16,
		borderWidth: 1,
		elevation: 3,
		flexDirection: "row",
		marginBottom: 14,
		padding: 14,
    },
    iconText: {
		color: "#FFFFFF",
		fontSize: 28,
	},
})