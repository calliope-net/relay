
Diese Seite bei [https://calliope-net.github.io/relay/](https://calliope-net.github.io/relay/) öffnen.

### Calliope Erweiterung für das i2c Modul:

* [SparkFun Qwiic Single Relay](https://www.sparkfun.com/products/15093)

![](https://cdn.sparkfun.com//assets/parts/1/3/4/5/1/15093-SparkFun_Qwiic_Single_Relay-01.jpg)

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne [makecode.calliope.cc](https://makecode.calliope.cc)
* klicke auf eine Projektvorlage
* klicke unter dem Zahnrad-Menü auf **Erweiterungen** (oder bei den Blöcken ganz unten)
* kopiere die folgende **Projekt-URL** in die Zwischenablage (Strg-C)
* **calliope-net/relay**
* füge sie auf der Webseite oben ein (Strg-V) und klicke auf die Lupe (oder ENTER)
* wenn die Erweiterung gefunden wurde, klicke auf das Rechteck
* jetzt hat die Liste den neuen Eintrag **Relay** bekommen

![](blocks.png)

### Beschreibung der Erweiterung für 'SparkFun Qwiic Single Relay'

Es könnte die einfachste i2c-Erweiterung sein, die es gibt: Eine (binäre) 0 an die i2c-Adresse gesendet schaltet das Relais aus, eine 1 schaltet es ein.
"Unter Umständen" funktioniert das tatsächlich so. (Relais-deutsch, Relay-englisch.)

Der erste Umstand ist, dass die i2c-Adresse 0x18 vom Calliope schon intern belegt ist. Intern belegt sind 3 Adressen 0x10, 0x18 und 0x68. 
Diese können von Modulen nicht verwendet werden.

Bei diesem Modul kann die i2c-Adresse geändert werden: entweder durch eine Lötbrücke in 0x19, dann ist der Adresskonflikt gelöst.
Oder mit einem i2c-Command-Code an 0x18. Das funktioniert, obwohl die 0x18 intern belegt ist. Hier wurde in 0x1E geändert. Erlaubt ist jede 7-Bit i2c-Adresse.
Und die Änderung bleibt erhalten. Wenn das Modul wieder an geschaltet wird, hat es immer noch die 0x1E in diesem Beispiel.
Anmerkung: Wenn die Lötbrücke vorhanden ist, wird die geänderte i2c-Adresse beim Ausschalten vergessen. Beim Einschalten gilt immer die 0x19. Damit müsste es nun funktionieren.

Der zweite Umstand ist, dass sich der gesamte i2c-Bus beim Einschalten aufhängt, wenn das Relay Modul angesteckt ist, egal mit welcher i2c-Adresse. Es wird dann überhaupt kein i2c-Modul erkannt, auch kein 
internes. Das kann verhindert werden, wenn das Relay Modul erst nach dem Einschalten an den i2c-Bus gesteckt wird. Dann sind die anderen 'Devices' am i2c-Bus bereit und die Adresse 0x19 oder 0x1E ebenfalls.





### Erweiterungen

> [Upates für Erweiterungen; Erweiterungen aus einem Projekt löschen.](https://calliope-net.github.io/i2c-liste#updates)

> [Alle i2c-Erweiterungen für MakeCode von calliope-net (Software).](https://calliope-net.github.io/i2c-liste#erweiterungen)

#### Calliope-Apps, .hex-Dateien, Bildschirmfotos mit Blöcken

> [Alle Beispiel-Projekte für MakeCode von calliope-net (Calliope-Apps).](https://calliope-net.github.io/i2c-liste#programmierbeispiele)

> GitHub-Profil calliope-net: [https://github.com/calliope-net](https://github.com/calliope-net)

### Bezugsquellen

> [Alle i2c-Module und Bezugsquellen (Hardware).](https://calliope-net.github.io/i2c-liste#bezugsquellen)

#### Metadaten (verwendet für Suche, Rendering)

* Calliope mini
* i2c
