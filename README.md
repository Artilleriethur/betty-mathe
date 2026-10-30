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
| `Betty.tastatur` | Formel eintippen und in den Chat kopieren |
| `Betty.zufall` | Zufallsexperimente mit relativen Häufigkeiten |

Beispiele stehen im Ordner `beispiele/`. Antworten werden mathematisch geprüft (`Term.gleich`): 2/4, 1/2 und 0,5 gelten als gleich, Terme werden durch Einsetzen verglichen, Listen in beliebiger Reihenfolge, Punkte als (x|y).

## Aufbau

`src/` enthält die Quellen (`term.js`, `tastatur.js`, `aufgabe.js`, `plot.js`, `seiten.js`, `basis.css`). `betty.js` ist daraus zusammengesetzt, `betty.min.js` mit terser verkleinert. Die Seiten laden `@main`; Änderungen an `main` kommen nach spätestens etwa einem Tag bei allen Seiten an (Cache von jsDelivr). Deshalb wird vor jedem Push getestet.

Keine Netzwerkzugriffe, keine Cookies, kein Speichern: Die Seiten laufen vollständig im Browser.
