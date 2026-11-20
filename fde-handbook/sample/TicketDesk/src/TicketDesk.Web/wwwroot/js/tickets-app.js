const { createApp } = Vue;

createApp({
  data() {
    return { tickets: [], audit: [], current: null, reply: "", busy: false, error: "" };
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      const res = await fetch("/api/tickets");
      this.tickets = await res.json();
      await this.loadAudit();
    },
    async loadAudit() {
      const res = await fetch("/api/audit");
      this.audit = await res.json();
    },
    select(t) {
      this.current = t;
      this.reply = t.finalReply || (t.triage ? t.triage.draftReply : "");
      this.error = "";
    },
    async runTriage() {
      this.busy = true;
      this.error = "";
      try {
        const res = await fetch("/api/tickets/" + this.current.id + "/triage", { method: "POST" });
        if (!res.ok) throw new Error("分流失敗（" + res.status + "）");
        const updated = await res.json();
        this.replaceTicket(updated);
        this.reply = updated.triage.draftReply;
        await this.loadAudit();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.busy = false;
      }
    },
    async approve() {
      this.busy = true;
      this.error = "";
      try {
        const res = await fetch("/api/tickets/" + this.current.id + "/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: this.reply })
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "核可失敗（" + res.status + "）");
        }
        this.replaceTicket(await res.json());
        await this.loadAudit();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.busy = false;
      }
    },
    // 以 fetch 讀取串流（EventSource 只支援 GET 且不易處理錯誤，這裡用 fetch 示範）
    async streamDraft() {
      this.busy = true;
      this.error = "";
      this.reply = "";
      try {
        const res = await fetch("/api/tickets/" + this.current.id + "/draft-stream");
        if (!res.ok || !res.body) throw new Error("串流失敗（" + res.status + "）");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf("\n\n")) >= 0) {
            const block = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            if (block.startsWith("data: ") && !block.includes("event: done")) {
              this.reply += JSON.parse(block.slice(6));
            }
          }
        }
      } catch (e) {
        this.error = e.message;
      } finally {
        this.busy = false;
      }
    },
    replaceTicket(updated) {
      const i = this.tickets.findIndex(x => x.id === updated.id);
      if (i >= 0) this.tickets.splice(i, 1, updated);
      this.current = updated;
    },
    statusText(s) {
      return { New: "新進", Triaged: "已分流", Replied: "已回覆" }[s] || s;
    }
  }
}).mount("#app");
