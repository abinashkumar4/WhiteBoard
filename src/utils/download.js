export function downloadCanvasAsJPEGWithWhiteBg(canvasId, filename = "board.jpeg") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas with ID "${canvasId}" not found.`);
      return;
    }
  
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
  
    const ctx = tempCanvas.getContext("2d");
  
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvas, 0, 0);
  
    const dataURL = tempCanvas.toDataURL("image/jpeg");
    const anchor = document.createElement("a");
    anchor.href = dataURL;
    anchor.download = filename;
    anchor.click();
  }
  