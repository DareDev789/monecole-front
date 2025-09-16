import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: "Helvetica"
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    schoolInfo: {
        flexDirection: "column",
        alignItems: "flex-end"
    },
    schoolName: {
        fontSize: 18,
        fontWeight: "bold"
    },
    title: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: "center"
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        flexDirection: "row"
    },
    tableColHeader: {
        width: "5%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: "#f0f0f0",
        padding: 4,
        fontWeight: "bold",
        textAlign: "center"
    },
    tableColName: {
        width: "50%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4
    },
    tableColPhone: {
        width: "20%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4
    },
    tableColAdresse: {
        width: "30%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4
    },
    tableColDate: {
        width: "20%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4,
        textAlign: "center"
    },
    tableCellHeader: {
        fontSize: 11,
        fontWeight: "bold"
    },
    tableCell: {
        fontSize: 10
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
                {/* En-tête avec logo et infos école */}
                <View style={styles.headerContainer}>
                    <Image src="/logo1.jpg" style={{ width: 90 }} />
                    <View style={styles.schoolInfo}>
                        <Text style={styles.schoolName}>Ecole Privée Les Petits Lutins</Text>
                        <Text>Diego Suarez, Madagascar</Text>
                        <Text>Année scolaire : 2025 - 2026</Text>
                        <Text>Classe : {classe?.name}</Text>
                    </View>
                </View>

                {/* Titre */}
                <Text style={styles.title}>
                    Liste des élèves ({students.length})
                </Text>

                {/* Tableau */}
                <View style={styles.table}>
                    {/* Ligne d'en-tête */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>#</Text>
                        </View>
                        <View style={styles.tableColName}>
                            <Text style={styles.tableCellHeader}>Nom et Prénom</Text>
                        </View>
                        <View style={styles.tableColPhone}>
                            <Text style={styles.tableCellHeader}>Téléphone</Text>
                        </View>
                        <View style={styles.tableColAdresse}>
                            <Text style={styles.tableCellHeader}>Adresse</Text>
                        </View>
                        <View style={styles.tableColDate}>
                            <Text style={styles.tableCellHeader}>Date de naissance</Text>
                        </View>
                    </View>

                    {/* Lignes élèves */}
                    {sortedStudents.map((s, i) => (
                        <View style={styles.tableRow} key={s.id}>
                            <View style={styles.tableColHeader}>
                                <Text style={styles.tableCell}>{i + 1}</Text>
                            </View>
                            <View style={styles.tableColName}>
                                <Text style={styles.tableCell}>
                                    {s.student?.first_name} {s.student?.last_name}
                                </Text>
                            </View>
                            <View style={styles.tableColPhone}>
                                <Text style={styles.tableCell}>{s.student?.parent_phone}</Text>
                            </View>
                            <View style={styles.tableColAdresse}>
                                <Text style={styles.tableCell}>{s.student?.address}</Text>
                            </View>
                            <View style={styles.tableColDate}>
                                <Text style={styles.tableCell}>
                                    {s.student?.birth_date
                                        ? new Date(s.student.birth_date).toLocaleDateString()
                                        : ""}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
