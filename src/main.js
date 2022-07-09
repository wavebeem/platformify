class HTMLPAppElement extends HTMLElement {
  /** @type {File} */
  file;
  /** @type {CanvasRenderingContext2D} */
  ctx;
  /** @type {HTMLImageElement} */
  img;

  connectedCallback() {
    this.ctx = this.canvas.getContext("2d");

    this.uploadButton.onclick = async () => {
      this.file = await this.pickImageFile();
      this.img = await this.loadImageFromFile(this.file);
      this.draw();
      this.imgContainer.hidden = false;
      this.saveButton.hidden = false;
    };

    this.saveButton.onclick = () => {
      const url = this.canvas.toDataURL();
      this.saveURL(url, this.file.name);
    };
  }

  draw() {
    const { ctx } = this;
    ctx.canvas.width = this.img.width;
    ctx.canvas.height = this.img.height;
    ctx.drawImage(this.img, 0, 0);
    ctx.fillStyle = "#ff4f00";
    const barHeight = ctx.canvas.height / 12;
    ctx.fillRect(0, ctx.canvas.height - barHeight, ctx.canvas.width, barHeight);
  }

  saveURL(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  /**
   * @type {Promise<HTMLImageElement>}
   * @arg file {File}
   */
  async loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  }

  /** @type {Promise<File>} */
  async pickImageFile() {
    return await new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.accept = "image/*";
      input.type = "file";
      input.onchange = () => {
        if (input.files?.length === 1) {
          const file = input.files[0];
          resolve(file);
        }
        reject(new Error("Please select one file"));
      };
      input.click();
    });
  }

  /** @type {HTMLCanvasElement} */
  get canvas() {
    return this.querySelector("canvas");
  }

  /** @type {HTMLDivElement} */
  get imgContainer() {
    return this.querySelector(".img-container");
  }

  /** @type {HTMLButtonElement} */
  get uploadButton() {
    return this.querySelector("#upload");
  }

  /** @type {HTMLButtonElement} */
  get saveButton() {
    return this.querySelector("#save");
  }
}

customElements.define("p-app", HTMLPAppElement);
