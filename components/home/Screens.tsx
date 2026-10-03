/* eslint-disable @next/next/no-img-element */
import { BOARD, DEMO, LEAD } from "./content";
import s from "./screens.module.css";

/**
 * The HTML on the device mockups. The animated ones are driven by the demo
 * timeline (DEMO in content.ts): `data-prog="from to"` gives it a
 * 0..1 `--s`, and every `data-step` inside switches on (`data-on`) once `--s`
 * passes it. The CRM and phone states are computed from the sample data in
 * content.ts and say on their face that they are a sample.
 */

const rel = (t: number, from: number, to: number) => ((t - from) / (to - from)).toFixed(3);

/* ------------------------------------------------------------- phones */

function StatusBar({ time }: { time: string }) {
  return (
    <div className={s.status}>
      <span>{time}</span>
      <span className={s.island} aria-hidden="true" />
      <span className={s.icons} aria-hidden="true">
        <svg viewBox="0 0 18 12" width="18" height="12">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 26 12" width="26" height="12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" />
          <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" />
          <rect x="23.5" y="4" width="2" height="4" rx="1" />
        </svg>
      </span>
    </div>
  );
}

/** The bottom of an iOS lock screen: torch, camera, home indicator. */
function LockFooter() {
  return (
    <div className={s.lockFooter} aria-hidden="true">
      <span className={s.lockBtn}>
        <svg viewBox="0 0 24 24"><path d="M8 3h8l-1 5H9zM9 8h6v12a1 1 0 01-1 1h-4a1 1 0 01-1-1zM12 12v3" /></svg>
      </span>
      <span className={s.lockBtn}>
        <svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
      </span>
      <span className={s.homeBar} />
    </div>
  );
}

function Notification({ app, icon, title, body, when, step, thumb }: { app: string; icon: "check" | "globe" | "cal"; title: string; body: string; when: string; step?: string; thumb?: string }) {
  return (
    <div className={`${s.notif} ${thumb ? s.withThumb : ""}`} data-step={step}>
      <span className={s.appIcon} aria-hidden="true">
        {icon === "check" && <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
        {icon === "globe" && <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" /></svg>}
        {icon === "cal" && <svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="14" rx="2" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></svg>}
      </span>
      <div>
        <p className={s.notifHead}>
          <span>{app}</span>
          <span>{when}</span>
        </p>
        <p className={s.notifTitle}>{title}</p>
        <p className={s.notifBody}>{body}</p>
      </div>
      {thumb && <img className={s.thumb} src={thumb} alt="" width={640} height={480} />}
    </div>
  );
}

export function PhoneScreen() {
  const [s0, , , , s4] = DEMO.stages;
  const from = s0 - 0.08, to = s4 + 0.08;
  return (
    <div className={s.phone} data-prog={`${from} ${to}`}>
      <div className={s.asleep} />
      <div className={s.night} data-step={rel(s0 - 0.02, from, to)}>
        <div className={s.wall} />
        <StatusBar time="23:14" />
        <div className={s.lockTime}>
          <span className={s.lockDay}>woensdag</span>
          <span className={s.lockClock}>23:14</span>
        </div>
        <div className={s.stack}>
          <Notification app="Website" icon="globe" title="Nieuwe aanvraag" body={`${LEAD.title} · ${LEAD.object}`} when="nu" thumb={LEAD.img} />
        </div>
        <LockFooter />
        <div className={s.dim} data-step={rel(s0 + 0.5, from, to)} />
      </div>
      <div className={s.morning} data-step={rel(s4 - 0.02, from, to)}>
        <div className={`${s.wall} ${s.wallDawn}`} />
        <StatusBar time="07:42" />
        <div className={s.lockTime}>
          <span className={s.lockDay}>donderdag</span>
          <span className={s.lockClock}>07:42</span>
        </div>
        <div className={s.stack}>
          <Notification app="Agenda" icon="cal" title="Plaatsbezoek bevestigd" body="Vrijdag 10:00 · Villa met tuin, Herent" when="nu" thumb={LEAD.img} />
          <Notification app="Website" icon="globe" title="Nieuwe aanvraag" body={`${LEAD.title} · ${LEAD.object}`} when="8 u." />
        </div>
        <LockFooter />
      </div>
    </div>
  );
}

/** The hero's phone: the request has just come in. Static, no timeline. */
export function HeroPhoneScreen() {
  return (
    <div className={s.phone}>
      <div className={s.wall} />
      <StatusBar time="23:14" />
      <div className={s.lockTime}>
        <span className={s.lockDay}>woensdag</span>
        <span className={s.lockClock}>23:14</span>
      </div>
      <div className={s.stack}>
        <Notification app="Website" icon="globe" title="Nieuwe aanvraag" body={`${LEAD.title} · ${LEAD.object}`} when="nu" thumb={LEAD.img} />
      </div>
      <LockFooter />
    </div>
  );
}

/* ------------------------------------------------------------ monitor */

export function MonitorScreen() {
  const [on0, on1] = DEMO.monitorOn;
  const st = DEMO.stages;
  const from = st[0] - 0.01, to = st[4] + 0.05;
  const at = (i: number) => rel(st[i], from, to);
  return (
    <div className={s.monitor} data-prog={`${on0} ${on1}`}>
      <div className={s.crm} data-prog={`${from} ${to}`}>
        <header className={s.top}>
          <span className={s.brand}>
            Kantoor<span>.</span>
          </span>
          <span className={s.search}>Zoek een pand of contact</span>
          <span className={s.sample}>Voorbeeldscenario</span>
          <span className={s.bell} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20a2 2 0 004 0" /></svg>
            <b data-step={at(0)}>1</b>
          </span>
        </header>
        <nav className={s.side}>
          <span data-current="true">Pijplijn</span>
          <span>Contacten</span>
          <span>Panden</span>
          <span>Agenda</span>
          <span>
            Automatisaties <em>aan</em>
          </span>
        </nav>
        <main className={s.board}>
          <h3 className={s.boardTitle}>Pijplijn · verkoop en waardebepaling</h3>
          <div className={s.cols}>
            {BOARD.columns.map((c, ci) => {
              const n = BOARD.cards.filter((k) => k.col === ci).length;
              return (
                <section key={c} className={s.col}>
                  <h4>
                    {c}
                    {ci === 0 && (
                      <span className={s.count}>
                        <span>{n + 1}</span>
                        <span data-step={at(4)}>{n}</span>
                      </span>
                    )}
                    {ci === 1 && <span className={s.count}><span>{n}</span></span>}
                    {ci === 2 && (
                      <span className={s.count}>
                        <span>{n}</span>
                        <span data-step={at(4)}>{n + 1}</span>
                      </span>
                    )}
                  </h4>
                  {ci === 0 && (
                    <article className={s.lead} data-step={at(4)}>
                      <img className={s.leadImg} src={LEAD.img} alt="" width={640} height={480} />
                      <p className={s.leadNew}>
                        <span>Nieuw · website</span>
                        <span>23:14</span>
                      </p>
                      <p className={s.cardTitle}>{LEAD.title}</p>
                      <p className={s.cardObject}>{LEAD.object}</p>
                      <p className={s.row} data-step={at(1)}>
                        <span className={s.tick} /> Bevestiging verstuurd
                      </p>
                      <p className={s.row} data-step={at(2)}>
                        <span className={s.avatar}>JIJ</span> Toegewezen aan jou
                      </p>
                      <p className={s.row} data-step={at(3)}>
                        <span className={s.clock} /> Herinnering vrijdag
                      </p>
                      <p className={`${s.row} ${s.booked}`} data-step={at(4)}>
                        <span className={s.tick} /> Plaatsbezoek vr 10:00
                      </p>
                    </article>
                  )}
                  {BOARD.cards
                    .filter((k) => k.col === ci)
                    .map((k) => (
                      <article key={k.object} className={s.card} data-shift={ci === 0 ? "up" : ci === 2 ? "down" : undefined} data-step={ci === 1 ? undefined : at(4)}>
                        <img className={s.cardImg} src={k.img} alt="" width={640} height={480} />
                        <div>
                          <p className={s.cardKind}>{k.title}</p>
                          <p className={s.cardObject}>{k.object}</p>
                          <p className={s.cardMeta}>{k.meta}</p>
                        </div>
                      </article>
                    ))}
                </section>
              );
            })}
          </div>
        </main>
        <aside className={s.log}>
          <h4>Automatisatie</h4>
          <ol>
            {LEAD.steps.map((step, i) => (
              <li key={step.title} data-step={at(i)}>
                <time>{step.time}</time>
                <div>
                  <p className={s.logTitle}>{step.title}</p>
                  <p className={s.logDetail}>{step.detail}</p>
                  {i === 1 && (
                    <div className={s.mail}>
                      <p>Onderwerp: Bedankt voor je aanvraag</p>
                      <span>Kies een moment</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <div className={s.off} />
    </div>
  );
}
