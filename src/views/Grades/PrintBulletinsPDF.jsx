import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: "Helvetica",
    },

    /* ===== HEADER ===== */
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        width: 80,
        height: 80,
    },
    schoolInfo: {
        marginLeft: 15,
    },
    schoolName: {
        fontSize: 14,
        fontWeight: "bold",
    },
    schoolAddress: {
        fontSize: 10,
    },

    /* ===== TITLES ===== */
    title: {
        fontSize: 16,
        marginVertical: 15,
        textAlign: "center",
        fontWeight: "bold",
        textTransform: "uppercase",
    },

    /* ===== INFO ROW ===== */
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    /* ===== TABLE ===== */
    table: {
        borderWidth: 1,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: '1px',
        borderTop: '1px'
    },
    th: {
        flex: 3,
        borderRightWidth: 1,
        padding: 5,
        fontWeight: "bold",
    },
    thSmall: {
        flex: 1,
        borderRightWidth: 1,
        padding: 5,
        fontWeight: "bold",
        textAlign: "center",
    },
    td: {
        flex: 3,
        borderRightWidth: 1,
        padding: 5,
    },
    tdSmall: {
        flex: 1,
        borderRightWidth: 1,
        padding: 5,
        textAlign: "center",
    },

    average: {
        marginTop: 10,
        textAlign: "right",
        fontWeight: "bold",
    },

    footer: {
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 11,
    },

    signatureTable: {
        marginTop: 40,
        borderWidth: 1,
    },

    signatureRow: {
        flexDirection: "row",
    },

    signatureCell: {
        flex: 1,
        borderRightWidth: 1,
        padding: 10,
        height: 70,
        justifyContent: "space-between",
    },

    signatureCellLast: {
        flex: 1,
        padding: 10,
        height: 70,
        justifyContent: "space-between",
    },

    signatureTitle: {
        fontSize: 11,
        fontWeight: "bold",
        textAlign: "center",
    },

});

export default function PrintBulletinsPDF({ students, className, termName, annee_scolaire, birth }) {

    const rankedStudents = [...students]
        .sort((a, b) => b.average - a.average)
        .map((s, index) => ({ ...s, rank: index + 1 }));

    return (
        <Document>
            {rankedStudents.map((student) => (
                <Page key={student.id} size="A4" style={styles.page}>

                    {/* ===== HEADER (RÉPÉTÉ À CHAQUE PAGE) ===== */}
                    <View style={styles.headerContainer}>
                        <Image src="/petits_lutin_logo-01.jpg" style={styles.logo} />
                        <View style={styles.schoolInfo}>
                            <Text style={styles.schoolName}>
                                Ecole Privée Les Petits Lutins
                            </Text>
                            <Text style={styles.schoolAddress}>
                                Diego Suarez, Madagascar
                            </Text>
                        </View>
                    </View>

                    {/* ===== TITRE ===== */}
                    <Text style={styles.title}>Bulletin de notes</Text>

                    {/* ===== INFOS ÉLÈVE ===== */}
                    <Text>
                        Élève : {student.first_name} {student.last_name}
                    </Text>
                    <Text>
                        Classe : {className}
                    </Text>
                    <Text>
                        Date de naissance : {student.birth}
                    </Text>
                    <Text>
                        Trimestre : {termName}
                    </Text>

                    {/* ===== TABLE NOTES ===== */}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.th}>Matière</Text>
                            <Text style={styles.thSmall}>Coef</Text>
                            <Text style={styles.thSmall}>{termName}</Text>
                        </View>

                        {student.subjects.map((sub) => (
                            <View key={sub.id} style={styles.tableRow}>
                                <Text style={styles.td}>{sub.name}</Text>
                                <Text style={styles.tdSmall}>
                                    {sub.coefficient}
                                </Text>
                                <Text style={styles.tdSmall}>
                                    {sub.grade ?? "-"}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.tableRow}>
                            <Text style={styles.td}>
                                Total :
                            </Text>
                            <Text style={styles.tdSmall}></Text>
                            <Text style={styles.tdSmall}>
                                {student.total}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.td}>
                                Moyenne :
                            </Text>
                            <Text style={styles.tdSmall}></Text>
                            <Text style={styles.tdSmall}>
                                {student.average}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.td}>
                                Rang :
                            </Text>
                            <Text style={styles.tdSmall}></Text>
                            <Text style={styles.tdSmall}>
                                {student.rank}{student.rank === 1 ? 'er' : 'ème'}
                            </Text>
                        </View>
                    </View>


                    {/* ===== FOOTER ===== */}
                    <View style={styles.signatureTable}>
                        <View style={styles.signatureRow}>
                            <View style={styles.signatureCell}>
                                <Text style={styles.signatureTitle}>Institutrice</Text>
                                <Text style={styles.signatureTitle}> </Text>
                            </View>

                            <View style={styles.signatureCell}>
                                <Text style={styles.signatureTitle}>Directrice</Text>
                                <Text style={styles.signatureTitle}>Hadiga Abdoul Noro</Text>
                            </View>

                            <View style={styles.signatureCellLast}>
                                <Text style={styles.signatureTitle}>Parents</Text>
                                <Text> </Text>
                            </View>
                        </View>
                    </View>
                </Page>
            ))}
        </Document>
    );
}
