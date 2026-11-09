import Icoon from "./Icoon";
import { DEMO, STAPPEN, type Scherm } from "./data";
import d from "./demo.module.css";

/**
 * Een nagebouwd Studio-scherm met verzonnen gegevens. Alle schermen staan
 * tegelijk in de DOM; `stap` bepaalt welk scherm scherp en zichtbaar is.
 * Animaties binnen een scherm starten pas als dat scherm actief wordt
 * (`data-actief`), zodat ze bij elke stap opnieuw spelen.
 */

const MENU = [
  { groep: "Vandaag", items: ["Start", "Agenda", "Mail", "Assistent"] },
  { groep: "Zaak", items: ["Pijplijn", "Klanten", "Facturen", "Omzet", "Sites"] },
];

const euro = (n: number) => n.toLocaleString("nl-BE", { style: "currency", currency: "EUR" });

function Kop({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <header className={d.kop}>
      <p className={d.kicker}>{kicker}</p>
      <h3 className={d.titel}>{children}</h3>
    </header>
  );
}

function Start() {
  return (
    <>
      <Kop kicker="Dinsdag 10 maart">
        Goeiemorgen, <em>{DEMO.naam}</em>
      </Kop>
      <p className={d.status}>3 afspraken vandaag, 2 mails die op je wachten en 1 offerte die vrijdag afloopt.</p>
      <div className={d.cijfers}>
        {DEMO.kerncijfers.map((c, i) => (
          <div key={c.label} className={d.cijfer} style={{ "--i": i } as React.CSSProperties}>
            <span className={d.rondje}>
              <Icoon naam={c.icoon} />
            </span>
            <span>
              <b>{c.waarde}</b>
              <small>{c.label}</small>
            </span>
          </div>
        ))}
      </div>
      <div className={d.twee}>
        <section className={d.paneel}>
          <h4>Vandaag</h4>
          <ul className={d.agenda}>
            {DEMO.agenda.map((a) => (
              <li key={a.tijd}>
                <time>{a.tijd}</time>
                <span>
                  {a.wat}
                  <small>{a.wie}</small>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className={d.paneel}>
          <h4>Je briefing, 07:00</h4>
          <ul className={d.briefing}>
            {DEMO.briefing.map((b, i) => (
              <li key={i} style={{ "--i": i } as React.CSSProperties}>
                {b}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function Pijplijn() {
  const n = DEMO.nieuw;
  return (
    <>
      <Kop kicker="Pijplijn">Van eerste contact tot akkoord</Kop>
      <div className={d.balk} aria-hidden="true">
        <i style={{ background: "#8a8178", flex: 2 }} />
        <i style={{ background: "#b08a5a", flex: 1 }} />
        <i style={{ background: "#d0764a", flex: 2 }} />
        <i style={{ background: "#6f8a6a", flex: 1 }} />
      </div>
      <div className={d.bord}>
        {DEMO.kolommen.map((k, ki) => (
          <div key={k} className={d.kolom}>
            <p className={d.kolomKop}>
              {k}
              <span>{DEMO.kaarten.filter((c) => c.kol === ki).length + (ki === 0 ? 1 : 0)}</span>
            </p>
            {ki === 0 && (
              <article className={`${d.kaart} ${d.nieuw}`}>
                <p className={d.kaartNaam}>{n.naam}</p>
                <p className={d.kaartWie}>{n.wie}</p>
                <p className={d.kaartWat}>{n.wat}</p>
                <p className={d.kaartBron}>
                  {n.bron} · {n.tijd}
                </p>
              </article>
            )}
            {DEMO.kaarten
              .filter((c) => c.kol === ki)
              .map((c) => (
                <article key={c.naam} className={d.kaart}>
                  <p className={d.kaartNaam}>{c.naam}</p>
                  <p className={d.kaartWie}>{c.wie}</p>
                  <p className={d.kaartWat}>
                    {c.wat}
                    {c.bedrag && <b>{c.bedrag}</b>}
                  </p>
                </article>
              ))}
          </div>
        ))}
      </div>
      <div className={d.melding} role="presentation">
        <span className={d.rondje}>
          <Icoon naam="mail" />
        </span>
        <span>
          <b>Nieuwe aanvraag · 23:14</b>
          <small>
            {n.naam}: {n.wat.toLowerCase()}
          </small>
        </span>
      </div>
    </>
  );
}

function Mail() {
  const m = DEMO.mail;
  return (
    <>
      <Kop kicker="Mail">Wacht op jou</Kop>
      <div className={d.mails}>
        <section className={d.paneel}>
          <p className={d.mailVan}>
            <b>{m.van}</b> · gisteren 23:14
          </p>
          <h4>{m.onderwerp}</h4>
          <p className={d.mailTekst}>{m.tekst}</p>
        </section>
        <section className={`${d.paneel} ${d.concept}`}>
          <p className={d.mailVan}>
            <Icoon naam="spark" className={d.mini} /> Concept van je assistent
          </p>
          <div className={d.antwoord}>
            {m.antwoord.map((r, i) => (
              <p key={i} style={{ "--i": i } as React.CSSProperties}>
                {r}
              </p>
            ))}
          </div>
          <div className={d.knoppen}>
            <span className={d.knop}>Versturen</span>
            <span className={d.knopStil}>Aanpassen</span>
          </div>
        </section>
      </div>
    </>
  );
}

function Assistent() {
  return (
    <>
      <Kop kicker="Assistent">
        Vraag het aan je <em>assistent</em>
      </Kop>
      <div className={d.chat}>
        {DEMO.chat.map((c, i) => (
          <p key={i} className={c.wie === "jij" ? d.jij : d.ai} style={{ "--i": i } as React.CSSProperties}>
            {c.tekst}
          </p>
        ))}
      </div>
      <div className={d.invoer}>
        <span>Stel een vraag over je zaak</span>
        <Icoon naam="micro" className={d.mini} />
      </div>
    </>
  );
}

function Factuur() {
  const f = DEMO.factuur;
  const totaal = f.lijnen.reduce((s, l) => s + l.bedrag, 0);
  return (
    <>
      <Kop kicker="Facturen">Factuur {f.nummer}</Kop>
      <div className={d.factuurRij}>
        <article className={d.blad}>
          <header>
            <p className={d.bladMerk}>
              Steyl<span>.</span>
            </p>
            <p>
              <b>Factuur {f.nummer}</b>
              <small>10 maart 2026</small>
            </p>
          </header>
          <p className={d.bladKlant}>
            <b>{f.klant}</b>
            <small>{f.adres}</small>
          </p>
          <table>
            <tbody>
              {f.lijnen.map((l) => (
                <tr key={l.wat}>
                  <td>{l.wat}</td>
                  <td>{euro(l.bedrag)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Totaal</td>
                <td>{euro(totaal)}</td>
              </tr>
            </tfoot>
          </table>
          <p className={d.bladVoet}>Te betalen binnen 14 dagen. Bijzondere vrijstellingsregeling kleine ondernemingen.</p>
        </article>
        <aside className={d.factuurZij}>
          <section className={d.paneel}>
            <h4>Status</h4>
            <ol className={d.tijdlijn}>
              <li data-klaar="">Opgemaakt, 10/03</li>
              <li data-klaar="">Gemaild naar Ann Peeters</li>
              <li className={d.betaald}>Betaald, 12/03</li>
            </ol>
          </section>
          <section className={d.paneel}>
            <h4>Open bij klanten</h4>
            <p className={d.groot}>{euro(2350)}</p>
            <small className={d.stilKlein}>2 facturen, geen enkele te laat</small>
          </section>
        </aside>
      </div>
    </>
  );
}

function Omzet() {
  const max = Math.max(...DEMO.omzet);
  return (
    <>
      <Kop kicker="Omzet">
        Dit jaar <em>tot nu toe</em>
      </Kop>
      <div className={d.twee}>
        <section className={`${d.paneel} ${d.omzetPaneel}`}>
          <h4>
            Omzet per maand <small>{euro(21200)} in 2026</small>
          </h4>
          <div className={d.grafiek} aria-hidden="true">
            {DEMO.omzet.map((v, i) => (
              <span key={i} style={{ "--h": v / max, "--i": i } as React.CSSProperties}>
                <i />
                <small>{DEMO.maanden[i]}</small>
              </span>
            ))}
          </div>
        </section>
        <section className={d.paneel}>
          <h4>Sitebewaker</h4>
          <ul className={d.sites}>
            {DEMO.sites.map((s, i) => (
              <li key={s.naam}>
                <span>
                  {s.naam}
                  <small>Online · {s.ms}</small>
                </span>
                <span className={d.score}>
                  <i style={{ "--w": s.score / 100, "--i": i } as React.CSSProperties} />
                  <b>{s.score}</b>
                </span>
              </li>
            ))}
          </ul>
          <p className={d.drempel}>
            <span>Btw-drempel</span>
            <span className={d.drempelBalk}>
              <i />
            </span>
            <small>Nog {euro(3800)} onder de grens van {euro(25000)}</small>
          </p>
        </section>
      </div>
    </>
  );
}

const SCHERMEN: Record<Scherm, () => React.ReactNode> = {
  start: Start,
  pijplijn: Pijplijn,
  mail: Mail,
  assistent: Assistent,
  factuur: Factuur,
  omzet: Omzet,
};

export default function StudioDemo({ stap }: { stap: number }) {
  const actief = STAPPEN[stap].nav;
  return (
    <div className={d.venster} data-g="" aria-hidden="true">
      <div className={d.chrome}>
        <span className={d.lichtjes}>
          <i />
          <i />
          <i />
        </span>
        <span className={d.url}>studio.jouwzaak.be</span>
        <span className={d.demoLabel}>Demo met verzonnen gegevens</span>
      </div>
      <div className={d.app}>
        <nav className={d.zij}>
          <p className={d.logo}>
            Sam<span>.</span>
          </p>
          {MENU.map((g) => (
            <div key={g.groep}>
              <p className={d.groep}>{g.groep}</p>
              <ul>
                {g.items.map((it) => (
                  <li key={it} data-actief={it === actief || undefined}>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className={d.schermen}>
          {STAPPEN.map((st, i) => {
            const Inhoud = SCHERMEN[st.scherm];
            return (
              <div key={st.scherm} className={`${d.scherm} ${d[st.scherm]}`} data-actief={i === stap || undefined}>
                <Inhoud />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
