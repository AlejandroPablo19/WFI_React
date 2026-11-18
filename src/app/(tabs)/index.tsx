import { Link, type Href } from "expo-router";
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const modules: {
	title: string;
	description: string;
	icon: string;
	href: Href;
}[] = [
	{
		title: "Frutas",
		description: "Consulta y agrega frutas",
		icon: "🍎",
		href: "/fruits",
	},
	{
		title: "Inventario",
		description: "Controla existencias",
		icon: "📦",
		href: "/inventory",
	},
	{
		title: "Entregas",
		description: "Administra pedidos y entregas",
		icon: "🚚",
		href: "/delivery",
	},
	{
		title: "Almacenes",
		description: "Consulta ubicaciones y capacidad",
		icon: "🏬",
		href: "/warehouse",
	},
];

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<FlatList
				contentContainerStyle={styles.content}
				data={modules}
				keyExtractor={(module) => module.title}
				ListHeaderComponent={
					<View style={styles.heading}>
						<Text style={styles.eyebrow}>WFI · ADMINISTRACIÓN</Text>
						<Text style={styles.title}>Módulos</Text>
						<Text style={styles.subtitle}>
							Elige qué área quieres consultar o administrar.
						</Text>
					</View>
				}
				numColumns={2}
				columnWrapperStyle={styles.row}
				renderItem={({ item }) => (
					<Link href={item.href} asChild>
						<Pressable
							accessibilityRole="button"
							style={({ pressed }) => [
								styles.card,
								pressed && styles.pressed,
							]}
						>
							<Text style={styles.icon}>{item.icon}</Text>
							<Text style={styles.cardTitle}>{item.title}</Text>
							<Text style={styles.cardDescription}>{item.description}</Text>
							<Text style={styles.openLabel}>Abrir módulo →</Text>
						</Pressable>
					</Link>
				)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: "#F3F8F7",
		flex: 1,
	},
	content: {
		flexGrow: 1,
		padding: 18,
		paddingBottom: 28,
	},
	heading: {
		marginBottom: 22,
		paddingTop: 16,
	},
	eyebrow: {
		color: "#39806E",
		fontSize: 11,
		fontWeight: "800",
		letterSpacing: 1.2,
		marginBottom: 8,
	},
	title: {
		color: "#173F4A",
		fontSize: 30,
		fontWeight: "800",
	},
	subtitle: {
		color: "#667A7F",
		fontSize: 15,
		lineHeight: 21,
		marginTop: 6,
	},
	row: {
		gap: 12,
		marginBottom: 12,
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderColor: "#E0E9E7",
		borderRadius: 18,
		borderWidth: 1,
		elevation: 2,
		flex: 1,
		minHeight: 176,
		padding: 16,
		shadowColor: "#173F4A",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 6,
	},
	icon: {
		fontSize: 30,
		marginBottom: 12,
	},
	cardTitle: {
		color: "#173F4A",
		fontSize: 17,
		fontWeight: "800",
	},
	cardDescription: {
		color: "#667A7F",
		fontSize: 13,
		lineHeight: 18,
		marginTop: 5,
	},
	openLabel: {
		color: "#27836F",
		fontSize: 12,
		fontWeight: "700",
		marginTop: "auto",
		paddingTop: 12,
	},
	pressed: {
		opacity: 0.76,
	},
});
