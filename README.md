# betty-mathe

Baukasten für interaktive Mathe-Seiten, die der KI-Tutor **Betty** (fobizz, Gymnasium Sachsen) im Chat erzeugt. Eine Seite besteht nur aus einer Konfiguration; Layout, Zeichnungen, Mathe-Tastatur, Termprüfung und Kopieren erledigt `betty.min.js`.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Artilleriethur/betty-mathe@main/betty.min.js"></script>
<script>
const CONFIG = { titel: "…", auftrag: "…", schritte: [ … ] };
Betty.lernschritte(CONFIG);
</script>
```

## Seitentypen

| Aufruf | wofür |
|---|---|
| `Betty.lernschritte` | Tafelentwicklung Schritt für Schritt mit wachsender Zeichnung, Reglern und Mini-Fragen |
| `Betty.funktionen` | Funktionen und Geometrie mit Reglern und ziehbaren Punkten |
| `Betty.uebung` | Aufgaben mit Mathe-Tastatur, Tipp, Lösungsweg und Rückmeldung zu typischen Fehlern |
| `Betty.probearbeit` | Probe-Klassenarbeit oder Probetest: Teil A/B, Punkte, Uhr, Auswahlaufgaben, Abgabe mit automatischer Prüfung |
| `Betty.baum` | Baumdiagramm: Pfade antippen, Pfadregeln mit Brüchen, Lückenäste; dazu `g.baum` für Zeichnungen |
| `Betty.umformen` | Gleichungen Zeile für Zeile lösen, jede Zeile wird auf Gleichwertigkeit geprüft, am Ende Probe |
| `Betty.zuordnen` | Paare antippen: Term ↔ Graph, Begriff ↔ Beispiel, mit Ablenkern und Prüfen |
| `Betty.fehlersuche` | vorgerechnete Lösung mit einem Fehler: falsche Zeile finden, erklären, verbessern |
| `Betty.vierfeld` | Vierfeldertafel und Baum gekoppelt, Baum umdrehbar, bedingte Wahrscheinlichkeiten, Lücken |
| `Betty.lernzettel` | Lernzettel zum Drucken (A4, zweispaltig) mit Merksätzen, Formeln, Skizzen und Ich-kann-Liste |
| `Betty.tastatur` | Formel eintippen und in den Chat kopieren |
| `Betty.zufall` | Zufallsexperimente mit relativen Häufigkeiten |

Beispiele stehen im Ordner `beispiele/`. Antworten werden mathematisch geprüft (`Term.gleich`): 2/4, 1/2 und 0,5 gelten als gleich, Terme werden durch Einsetzen verglichen, Listen in beliebiger Reihenfolge, Punkte als (x|y).

Ein paar Verhaltensregeln:

- Bei Fragen erscheint nach dem ersten Fehlversuch der Tipp. Der Lösungsweg kommt nach einer richtigen Antwort oder nach drei Versuchen; mit `wegNach: 2` an der Frage geht es früher.
- Regler mit `pi: true` zeigen Vielfache von π. Ist der Regler ein Winkel (α, φ, „Winkel“, „Drehwinkel“) oder hat er `grad: true`, steht Grad daneben, etwa „60° = π/3“.
- Zeichnet eine Seite mit `g.kreis` oder `g.bogen` und legt `gleicheEinheiten` nicht selbst fest, werden die Einheiten gleich gesetzt, damit Kreise rund bleiben.
- Die Mathe-Tastatur ist pro Seite, Frage oder Feld einstellbar (`tastatur: "trigonometrie"` oder `{ variablen, konstanten, funktionen, zeichen, griechisch, strukturen, ebenen }`). Links wechseln 8 Tasten je Ebene, Ziffern und Operatoren bleiben an ihrem Platz.
- Fragen ohne `antwort` werden nicht bewertet, sondern notiert („bitte prüfen“).
- Beschriftungen in `g.text` dürfen `$…$` enthalten; daraus wird lesbarer Text (`$x_1$` → x₁, `$\\alpha$` → α).

## Aufbau

`src/` enthält die Quellen (`term.js`, `tastatur.js`, `aufgabe.js`, `plot.js`, `seiten.js`, `basis.css`). `betty.js` ist daraus zusammengesetzt, `betty.min.js` mit terser verkleinert. Der Skill im Chat lädt eine feste Version (`@<commit>`), weil jsDelivr `@main` lange zwischenspeichert. Nach einer Änderung wird der Skill mit der neuen Commit-Adresse neu hochgeladen. Vor jedem Push wird getestet.

Keine Netzwerkzugriffe, keine Cookies, kein Speichern: Die Seiten laufen vollständig im Browser.
