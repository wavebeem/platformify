class HTMLPAppElement extends HTMLElement {
  /** @type {File} */
  file;
  /** @type {CanvasRenderingContext2D} */
  ctx;
  /** @type {HTMLImageElement} */
  img;
  /** @type {"overlay" | "below"} */
  platformLocation = "overlay";

  connectedCallback() {
    this.ctx = this.canvas.getContext("2d");
    this.uploadButton.onclick = this.onUpload;
    this.saveButton.onclick = this.onSave;
    for (const locationRadio of this.locationRadios) {
      locationRadio.onchange = this.onLocationChange;
    }
  }

  onLocationChange = (event) => {
    if (event.target.checked) {
      this.platformLocation = event.target.value;
      this.draw();
    }
  };

  onSave = () => {
    const url = this.canvas.toDataURL();
    this.saveURL(url, this.file.name);
  };

  onUpload = async () => {
    this.file = await this.pickImageFile();
    this.img = await this.loadImageFromFile(this.file);
    this.draw();
    this.hiddenContent.hidden = false;
  };

  draw() {
    const { ctx, platformLocation } = this;
    const barHeight = Math.round(this.img.height / 12);
    ctx.canvas.width = this.img.width;
    if (platformLocation === "overlay") {
      ctx.canvas.height = this.img.height;
      ctx.drawImage(this.img, 0, 0);
      ctx.fillStyle = "#ff4f00";
      ctx.fillRect(
        0,
        ctx.canvas.height - barHeight,
        ctx.canvas.width,
        barHeight
      );
    } else {
      ctx.canvas.height = this.img.height + barHeight;
      ctx.drawImage(this.img, 0, 0);
      ctx.fillStyle = "#ff4f00";
      ctx.fillRect(0, this.img.height, ctx.canvas.width, barHeight);
    }
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

  /** @type {HTMLDivElement} */
  get hiddenContent() {
    return this.querySelector("#hidden-content");
  }

  /** @type {HTMLInputElement[]} */
  get locationRadios() {
    return Array.from(this.querySelectorAll("[name=platform-location]"));
  }
}

customElements.define("p-app", HTMLPAppElement);
