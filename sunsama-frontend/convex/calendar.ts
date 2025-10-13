/*import { query, QueryCtx, Mutation, MutationCtx} from "./_generated/server";                        // Importiert die Convex-Funktion 'query', mit der man serverseitige Leseabfragen definiert.

export const getDays = query({                                      // Definiert eine neue Convex-Query mit dem Namen 'getDays'.
  args : { totalDays: "number"},
  
  handler : async (ctx : QueryCtx, { totalDays = 60 }: { totalDays?: number }) => {        // Erstes Argument (_) ist der Context (hier nicht genutzt), zweites Argument ist unser Parameterobjekt (mit Standardwert 60).
    const days: { name: string; date: string; fullDate: string }[] = [];  // Legt ein leeres Array 'days' an, das später alle generierten Tagesobjekte enthalten wird.

    const centerDate = new Date();                                 // Erstellt ein Date-Objekt mit dem aktuellen Datum (heute).
    const startDate = new Date(centerDate);                         // Erstellt eine Kopie des heutigen Datums, die als Startpunkt dient.
    startDate.setDate(startDate.getDate() - Math.floor(totalDays / 2));  // Verschiebt das Startdatum um die Hälfte der Gesamtanzahl zurück (z. B. 30 Tage bei totalDays = 60).

    for (let i = 0; i < totalDays; i++) {                           // Startet eine Schleife, die 'totalDays' Mal durchläuft.
      const d = new Date(startDate);                                // Erstellt ein neues Date-Objekt auf Basis des Startdatums.
      d.setDate(startDate.getDate() + i);                            // Addiert i Tage zum Startdatum, um das Datum des jeweiligen Tages zu berechnen.

      const totalDays = await ctx.db.query("calendar days")                                             // Fügt ein neues Objekt ins 'days'-Array                                  //  → 'fullDate' ist das vollständige ISO-Datum (z. B. "2025-10-13T00:00:00.000Z").
    }

    return days;                                                    // Gibt das gesamte Array der generierten Tage zurück → wird im Frontend mit useQuery verwendet.
  }
});

export const addDays = Mutation({
  args : { totalDays: "number" },
  handler : async (ctx: MutationCtx) => {
    await ctx.db.insert("all Days",{
      name: "New Day",
      date: "New Date",
      fullDate: new Date().toISOString(),
    });
  }
})
*/
