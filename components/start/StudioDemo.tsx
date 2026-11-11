import Icoon from "./Icoon";
import { STAPPEN, STIJLEN, type Scherm, type Stijl } from "./data";
import { DEMOS, MAANDEN, type Demo } from "./demos";
import d from "./demo.module.css";

/**
 * Een nagebouwd Studio-scherm met verzonnen gegevens. Alle schermen staan
 * tegelijk in de DOM; `stap` bepaalt welk scherm scherp en zichtbaar is.
 * Animaties binnen een scherm starten pas als dat scherm actief wordt
 * (`data-actief`), zodat ze bij elke stap opnieuw spelen.
 */

const euro = (n: number) => n.toLocaleString("nl-BE", { style: "currency", currency: "EUR" });

function Kop({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <header className={d.kop}>
      <p className={d.kicker}>{kicker}</p>
      <h3 className={d.titel}>{children}</h3>
    </header>
  );
}

function Start({ demo }: { demo: Demo }) {
  const D = demo.start;
  return (
    <>
      <Kop kicker="Dinsdag 10 maart">
        Goeiemorgen, <em>{demo.naam}</em>
      </Kop>
      <p className={d.status}>{D.status}</p>
      <div className={d.cijfers}>
        {D.kerncijfers.map((c, i) => (
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
            {D.agenda.map((a) => (
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
            {D.briefing.map((b, i) => (
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

function Pijplijn({ demo }: { demo: Demo }) {
  const P = demo.pijplijn;
  const n = P.nieuw;
  return (
    <>
      <Kop kicker={P.kicker}>{P.titel}</Kop>
      <div className={d.balk} aria-hidden="true">
        <i style={{ background: "#8a8178", flex: 2 }} />
        <i style={{ background: "#b08a5a", flex: 1 }} />
        <i style={{ background: "#d0764a", flex: 2 }} />
        <i style={{ background: "#6f8a6a", flex: 1 }} />
      </div>
      <div className={d.bord}>
        {P.kolommen.map((k, ki) => (
          <div key={k} className={d.kolom}>
            <p className={d.kolomKop}>
              {k}
              <span>{P.kaarten.filter((c) => c.kol === ki).length + (ki === 0 ? 1 : 0)}</span>
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
            {P.kaarten
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
          <b>{P.melding}</b>
          <small>
            {n.naam}: {n.wat.toLowerCase()}
          </small>
        </span>
      </div>
    </>
  );
}

function Mail({ demo }: { demo: Demo }) {
  const m = demo.mail;
  return (
    <>
      <Kop kicker="Mail">Wacht op jou</Kop>
      <div className={d.mails}>
        <section className={d.paneel}>
          <p className={d.mailVan}>
            <b>{m.van}</b> · {m.tijd}
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

function Assistent({ demo }: { demo: Demo }) {
  return (
    <>
      <Kop kicker="Assistent">
        Vraag het aan je <em>assistent</em>
      </Kop>
      <div className={d.chat}>
        {demo.chat.items.map((c, i) => (
          <p key={i} className={c.wie === "jij" ? d.jij : d.ai} style={{ "--i": i } as React.CSSProperties}>
            {c.tekst}
          </p>
        ))}
      </div>
      <div className={d.invoer}>
        <span>{demo.chat.invoer}</span>
        <Icoon naam="micro" className={d.mini} />
      </div>
    </>
  );
}

function Factuur({ demo, merk }: { demo: Demo; merk: string }) {
  const f = demo.factuur;
  const totaal = f.lijnen.reduce((s, l) => s + l.bedrag, 0);
  return (
    <>
      <Kop kicker={f.kicker}>{f.titel}</Kop>
      <div className={d.factuurRij}>
        <article className={d.blad}>
          <header>
            <p className={d.bladMerk}>
              {merk}
              {merk === "Steyl" && <span>.</span>}
            </p>
            <p>
              <b>{f.titel}</b>
              <small>{f.datum}</small>
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
                <td>{f.totaal}</td>
                <td>{euro(totaal)}</td>
              </tr>
            </tfoot>
          </table>
          <p className={d.bladVoet}>{f.voet}</p>
        </article>
        <aside className={d.factuurZij}>
          <section className={d.paneel}>
            <h4>Status</h4>
            <ol className={d.tijdlijn}>
              <li data-klaar="">{f.status[0]}</li>
              <li data-klaar="">{f.status[1]}</li>
              <li className={d.betaald}>{f.status[2]}</li>
            </ol>
          </section>
          <section className={d.paneel}>
            <h4>{f.open.titel}</h4>
            <p className={d.groot}>{euro(f.open.waarde)}</p>
            <small className={d.stilKlein}>{f.open.sub}</small>
          </section>
        </aside>
      </div>
    </>
  );
}

function Omzet({ demo }: { demo: Demo }) {
  const o = demo.omzet;
  const max = Math.max(...o.waarden);
  return (
    <>
      <Kop kicker={o.kicker}>
        {o.titel}
        <em>{o.accent}</em>
      </Kop>
      <div className={d.twee}>
        <section className={`${d.paneel} ${d.omzetPaneel}`}>
          <h4>
            {o.grafiek} <small>{o.totaal}</small>
          </h4>
          <div className={d.grafiek} aria-hidden="true">
            {o.waarden.map((v, i) => (
              <span key={i} style={{ "--h": v / max, "--i": i } as React.CSSProperties}>
                <i />
                <small>{MAANDEN[i]}</small>
              </span>
            ))}
          </div>
        </section>
        <section className={d.paneel}>
          <h4>{o.lijst}</h4>
          <ul className={d.sites}>
            {o.items.map((s, i) => (
              <li key={s.naam}>
                <span>
                  {s.naam}
                  <small>{s.sub}</small>
                </span>
                <span className={d.score}>
                  <i style={{ "--w": s.score / 100, "--i": i } as React.CSSProperties} />
                  <b>
                    {s.score}
                    {s.eenheid}
                  </b>
                </span>
              </li>
            ))}
          </ul>
          <p className={d.drempel}>
            <span>{o.drempel.label}</span>
            <span className={d.drempelBalk}>
              <i style={{ width: `${o.drempel.w * 100}%` }} />
            </span>
            <small>{o.drempel.tekst}</small>
          </p>
        </section>
      </div>
    </>
  );
}

const SCHERMEN: Record<Scherm, (p: { demo: Demo; merk: string }) => React.ReactNode> = {
  start: Start,
  pijplijn: Pijplijn,
  mail: Mail,
  assistent: Assistent,
  factuur: Factuur,
  omzet: Omzet,
};

export default function StudioDemo({ stap, stijl = "studio" }: { stap: number; stijl?: Stijl }) {
  const merk = STIJLEN.find((x) => x.id === stijl) ?? STIJLEN[0];
  const demo = DEMOS[stijl];
  const actief = demo.stappen[stap].nav;
  return (
    <div className={d.venster} data-g="" data-stijl={stijl} aria-hidden="true">
      <div className={d.chrome}>
        <span className={d.lichtjes}>
          <i />
          <i />
          <i />
        </span>
        <span className={d.url}>{merk.url}</span>
        <span className={d.demoLabel}>Demo met verzonnen gegevens</span>
      </div>
      <div className={d.app}>
        <nav className={d.zij}>
          <p className={d.logo}>
            {merk.logo}
            {stijl === "studio" && <span>.</span>}
          </p>
          {demo.menu.map((g) => (
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
                <Inhoud demo={demo} merk={stijl === "studio" ? "Steyl" : merk.logo} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
