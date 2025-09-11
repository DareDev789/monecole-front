import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
    header: { textAlign: "center", marginBottom: 30 },
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    section: { marginBottom: 15 },
    bold: { fontWeight: "bold" },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 30
    },
    schoolInfo: {
        flexDirection: "column",
        alignItems: "flex-start",
        marginLeft: 15
    },
    schoolName: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 5
    },
});

export default function PrintRadiation({ student, className }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <Image src="/logo1.jpg" style={{ width: 90 }} />
                    <View style={styles.schoolInfo}>
                        <Text style={styles.schoolName}>Ecole Privée Les Petits Lutins</Text>
                        <Text>Diego Suarez, Madagascar</Text>
                        <Text>Tél. 032 40 182 42</Text>
                        <Text>Email : hadigadie@gmail.com</Text>
                    </View>
                </View>
                <View style={styles.header}>
                    <Text style={styles.title}>ATTESTATION DE RADIATION</Text>
                </View>

                <View style={styles.section}>
                    <Text>Je soussigné(e), le directeur de l’établissement certifie que :</Text>
                </View>

                <View style={styles.section}>
                    <Text>
                        <Text style={styles.bold}>{student.first_name} {student.last_name}</Text>, né(e) le{" "}
                        {new Date(student.birth_date).toLocaleDateString()}, a été inscrit(e) dans notre
                        établissement en classe de {className}.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text>
                        Il/Elle a quitté l’établissement à la date du {new Date().toLocaleDateString()} et
                        est donc radié(e) des listes de l’école.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text>Fait à Antsiranana, le {new Date().toLocaleDateString()}</Text>
                </View>

                <View style={styles.section}>
                    <Text>Signature et cachet de l’établissement</Text>
                </View>
            </Page>
        </Document>
    );
}
