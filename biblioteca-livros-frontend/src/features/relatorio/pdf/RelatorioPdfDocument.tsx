import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { RelatorioLivroPorAutorItem } from "../types";
import { formatBRL } from "../../livros/utils/currency";

type Group = {
  autorCodAu: number;
  autorNome: string;
  itens: RelatorioLivroPorAutorItem[];
};

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 16, marginBottom: 6, fontWeight: 700 },
  subtitle: { fontSize: 10, color: "#555", marginBottom: 12 },
  sectionTitle: { fontSize: 12, marginTop: 10, marginBottom: 6, fontWeight: 700 },
  table: { borderWidth: 1, borderColor: "#ddd", borderRadius: 4 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerRow: { backgroundColor: "#f6f7f9" },
  cell: { padding: 6 },
  colTitle: { width: "28%" },
  colEditora: { width: "18%" },
  colEdicao: { width: "8%" },
  colAno: { width: "10%" },
  colValor: { width: "12%", textAlign: "right" },
  colAssuntos: { width: "24%" },
  headerText: { fontWeight: 700 },
  muted: { color: "#666" },
});

export function RelatorioPdfDocument({ groups, generatedAt }: { groups: Group[]; generatedAt: Date }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório de livros por autor</Text>
        <Text style={styles.subtitle}>Gerado em {generatedAt.toLocaleString("pt-BR")}</Text>

        {groups.map((group) => (
          <View key={group.autorCodAu} wrap={false}>
            <Text style={styles.sectionTitle}>{group.autorNome}</Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.colTitle, styles.headerText]}>Livro</Text>
                <Text style={[styles.cell, styles.colEditora, styles.headerText]}>Editora</Text>
                <Text style={[styles.cell, styles.colEdicao, styles.headerText]}>Edição</Text>
                <Text style={[styles.cell, styles.colAno, styles.headerText]}>Ano</Text>
                <Text style={[styles.cell, styles.colValor, styles.headerText]}>Valor</Text>
                <Text style={[styles.cell, styles.colAssuntos, styles.headerText]}>Assuntos</Text>
              </View>

              {group.itens.map((item) => (
                <View key={`${item.codAutor}-${item.codLivro}`} style={styles.row}>
                  <Text style={[styles.cell, styles.colTitle]}>{item.titulo}</Text>
                  <Text style={[styles.cell, styles.colEditora]}>{item.editora}</Text>
                  <Text style={[styles.cell, styles.colEdicao]}>{String(item.edicao)}</Text>
                  <Text style={[styles.cell, styles.colAno]}>{item.anoPublicacao}</Text>
                  <Text style={[styles.cell, styles.colValor]}>{formatBRL(item.valor)}</Text>
                  <Text style={[styles.cell, styles.colAssuntos, styles.muted]}>{item.assuntos}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}

