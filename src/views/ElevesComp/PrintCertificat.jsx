import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica"
    },
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
    title: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: "center",
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    bodyText: {
        fontSize: 12,
        lineHeight: 1.6,
        textAlign: "justify",
        marginBottom: 15
    },
    bold: {
        fontWeight: "bold"
    },
    footer: {
        marginTop: 40,
        textAlign: "right",
        fontSize: 12
    }
});

export default function PrintableClasse({ student, className }) {
    const today = new Date().toLocaleDateString();
    console.log(className);

    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.page}>
                {/* En-tête avec logo et infos école */}
                <View style={styles.headerContainer}>
                    <Image src="/logo1.jpg" style={{ width: 90 }} />
                    <View style={styles.schoolInfo}>
                        <Text style={styles.schoolName}>Ecole Privée Les Petits Lutins</Text>
                        <Text>Diego Suarez, Madagascar</Text>
                        <Text>Tél. 032 40 182 42</Text>
                        <Text>Email : hadigadie@gmail.com</Text>
                    </View>
                </View>

                {/* Titre */}
                <Text style={styles.title}>
                    Certificat de scolarité
                </Text>

                {/* Corps du certificat */}
                <Text style={styles.bodyText}>
                    Je soussignée, Madame <Text style={styles.bold}>Hadiga Abdoul Noro</Text>,{" "}
                    agissant en qualité de Directrice de l'École Primaire Privée Les Petits Lutins de Diego Suarez, 
                    atteste et certifie que l’élève{" "}
                    <Text style={styles.bold}>
                        {student?.first_name} {student?.last_name}
                    </Text>, né(e) le{" "}
                    {student?.birth_date ? new Date(student.birth_date).toLocaleDateString() : ""}{" "}
                    à {student?.birth_place || "________"}, inscrit(e) dans la classe de{" "}
                    <Text style={styles.bold}>{className || "________"}</Text>,
                    fils/fille de <Text style={styles.bold}>{student?.parent_name}</Text>, 
                    a fréquenté notre établissement depuis le{" "}
                    {student?.enrollment_date
                        ? new Date(student.enrollment_date).toLocaleDateString()
                        : "________"}{" "}
                    et est présent(e) à ce jour {today}.
                </Text>

                {/* Pied de page */}
                <Text style={styles.footer}>
                    Fait à Antsiranana, le {today}
                </Text>
            </Page>
        </Document>
    );
}