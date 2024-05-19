export function setReverseValue(setter, key) {
  setter((prev) => {
    if (!prev[key]) {
      for (let i in prev) {
        prev[i] = false;
      }
      prev[key] = true;
    } else {
      prev[key] = false;
    }
    return { ...prev };
  });
}

export function handleZoomIn(setHelperTools) {
  setHelperTools((prev) => ({
    ...prev,
    zoom: prev.zoom + 1,
  }));
}

export function handleZoomOut(setHelperTools) {
  setHelperTools((prev) => ({
    ...prev,
    zoom: prev.zoom - 1,
  }));
}

export function toolbarButtonAttrs(isVariantAvailable = false, filled = false) {
  const configures = {
    color: "secondary",
    size: "lg",
  }
  return isVariantAvailable
    ? {
        size: configures.size,
        isIconOnly: true,
        color: configures.color,
        variants: (configures.filled ? "flat" : "flat"),
      }
    : {
        size: configures.size,
        isIconOnly: true,
        color: configures.color,
        // variants: "flat"
      };
}
