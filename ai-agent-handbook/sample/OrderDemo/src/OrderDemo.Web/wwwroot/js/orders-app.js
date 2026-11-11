const { createApp } = Vue;

createApp({
  data() {
    return { departmentId: 1, status: "", orders: [] };
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      const query = new URLSearchParams({ departmentId: this.departmentId });
      if (this.status) {
        query.append("status", this.status);
      }
      const response = await fetch("/api/orders?" + query);
      this.orders = await response.json();
    },
    async cancel(order) {
      await fetch("/api/orders/" + order.id + "/cancel?departmentId=" + this.departmentId, { method: "POST" });
      await this.load();
    },
    statusText: OrderUtils.statusText,
    formatDate: OrderUtils.formatDate
  }
}).mount("#app");
