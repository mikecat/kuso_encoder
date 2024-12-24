"use strict";

window.addEventListener("DOMContentLoaded", () => {
	const hirabunArea = document.getElementById("hirabunArea");
	const copyHirabunButton = document.getElementById("copyHirabunButton");
	const copyKusoButton = document.getElementById("copyKusoButton");
	const kusoArea = document.getElementById("kusoArea");

	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

	const hirabunToKuso = () => {
		const kusoData = encoder.encode(hirabunArea.value);
		let res = "";
		for (let i = 0; i < kusoData.length; i++) {
			for (let j = 7; j >= 0; j--) {
				res += (kusoData[i] >> j) & 1 ? "ソ" : "ク";
			}
		}
		kusoArea.value = res;
	};

	const kusoToHirabun = () => {
		const kuso = kusoArea.value;
		const kusoData = [];
		let byte = 0, bit = 0;
		for (let i = 0; i < kuso.length; i++) {
			const idx = "クソ".indexOf(kuso.charAt(i));
			if (idx >= 0) {
				byte |= idx << (7 - bit);
				bit++;
				if (bit >= 8) {
					kusoData.push(byte);
					byte = 0;
					bit = 0;
				}
			}
		}
		if (bit > 0) kusoData.push(byte);
		hirabunArea.value = decoder.decode(new Uint8Array(kusoData));
	};

	hirabunArea.addEventListener("input", hirabunToKuso);
	kusoArea.addEventListener("input", kusoToHirabun);

	if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
		let copyHirabunTimerId = null, copyKusoTimerId = null;

		const setCopyHirabunButtonText = (text) => {
			if (copyHirabunTimerId !== null) clearTimeout(copyHirabunTimerId);
			copyHirabunButton.textContent = text;
			copyHirabunTimerId = setTimeout(() => {
				copyHirabunButton.textContent = "平文をコピー";
				copyHirabunTimerId = null;
			}, 1000);
		};

		const setCopyKusoButtonText = (text) => {
			if (copyKusoTimerId !== null) clearTimeout(copyKusoTimerId);
			copyKusoButton.textContent = text;
			copyKusoTimerId = setTimeout(() => {
				copyKusoButton.textContent = "クソをコピー";
				copyKusoTimerId = null;
			}, 1000);
		};

		copyHirabunButton.addEventListener("click", () => {
			navigator.clipboard.writeText(hirabunArea.value).then(() => {
				setCopyHirabunButtonText("コピーしたよ");
			}, (error) => {
				console.error(error);
				setCopyHirabunButtonText("コピー失敗！");
			});
		});

		copyKusoButton.addEventListener("click", () => {
			navigator.clipboard.writeText(kusoArea.value).then(() => {
				setCopyKusoButtonText("コピーしたよ");
			}, (error) => {
				console.error(error);
				setCopyKusoButtonText("コピー失敗！");
			});
		});
	} else {
		copyHirabunButton.disabled = true;
		copyKusoButton.disabled = true;
	}

	hirabunToKuso();
});
