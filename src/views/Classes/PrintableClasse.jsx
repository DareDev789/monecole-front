import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10
    },
    header: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 10
    },
    student: {
        marginBottom: 4,
        padding: 4,
        borderBottom: "1px solid #ccc"
    }
});

export default function PrintableClasse({ classe, students }) {
    const sortedStudents = [...students].sort((a, b) => {
        const nameA = `${a.student?.first_name || ""} ${a.student?.last_name || ""}`.toLowerCase();
        const nameB = `${b.student?.first_name || ""} ${b.student?.last_name || ""}`.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.page}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    {/* Logo à gauche */}
                    <Image
                        src="/logo1.jpg"
                        style={{ width: 90 }}
                    />
                    {/* Infos à droite */}
                    <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Ecole Privée Les Petits Lutins</Text>
                        <Text>Diego Suarez, Madagascar</Text>
                        <Text>Année scolaire : 2025 - 2026</Text>
                        <Text>Classe : {classe?.name}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 14, marginBottom: 10 }}>
                        Liste des élèves ({students.length})
                    </Text>
                    {sortedStudents.map((s, i) => (
                        <View key={s.id} style={styles.student}>
                            <Text>
                                {i + 1}. {s.student?.first_name} {s.student?.last_name}
                            </Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
