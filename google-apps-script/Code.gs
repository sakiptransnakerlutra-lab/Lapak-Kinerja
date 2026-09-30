/**
 * E-SAKIP & LKE DINAS TRANSMIGRASI DAN TENAGA KERJA KABUPATEN LUWU UTARA
 * Google Apps Script Web App Backend (Code.gs)
 * 
 * Penggunaan:
 * 1. Buka https://script.google.com/
 * 2. Buat "Project Baru"
 * 3. Salin kode ini ke file "Code.gs"
 * 4. Buat file HTML baru dengan nama "index.html" dan salin isi file index.html
 * 5. Klik tombol "Deploy" -> "New deployment" -> Pilih tipe "Web app"
 * 6. Set "Execute as": "Me" dan "Who has access": "Anyone" (atau sesuai kebutuhan organisasi)
 * 7. Klik "Deploy" dan salin URL Web App yang dihasilkan.
 */

// Konstanta Konfigurasi
var APP_CONFIG = {
  APP_TITLE: 'E-SAKIP & LKE DINAS TRANSMIGRASI DAN TENAGA KERJA KABUPATEN LUWU UTARA',
  KABUPATEN: 'KABUPATEN LUWU UTARA',
  TAHUN: '2026',
  // ID Folder Google Drive tempat menyimpan berkas dokumen evidence (opsional)
  // Biarkan kosong jika ingin disimpan di folder root Google Drive
  DRIVE_FOLDER_ID: '',
  // ID Google Spreadsheet jika ingin menyimpan database ke Sheets (opsional)
  SPREADSHEET_ID: ''
};

/**
 * Endpoint utama HTTP GET untuk menampilkan antarmuka Web App
 */
function doGet(e) {
  var htmlOutput = HtmlService.createTemplateFromFile('index').evaluate();
  
  return htmlOutput
    .setTitle(APP_CONFIG.APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .addMetaTag('description', 'Sistem Informasi Akuntabilitas Kinerja Instansi Pemerintah & Lembar Kerja Evaluasi SAKIP Dinas Transnaker Luwu Utara')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Endpoint HTTP POST untuk integrasi webhook atau pengiriman data langsung
 */
function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var action = data.action;
    
    var response = { status: 'success', action: action };
    
    if (action === 'saveLKE') {
      response.result = saveLKEData(data.items);
    } else if (action === 'saveKKE') {
      response.result = saveKKEData(data.items);
    } else if (action === 'uploadFile') {
      response.result = uploadEvidenceToDrive(data.base64, data.fileName, data.mimeType);
    } else {
      response.message = 'Aksi tidak dikenali';
    }
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menyimpan data LKE ke Script Properties atau Google Sheets
 */
function saveLKEData(items) {
  try {
    var jsonString = typeof items === 'string' ? items : JSON.stringify(items);
    var props = PropertiesService.getScriptProperties();
    props.setProperty('DATA_LKE', jsonString);
    
    // Simpan juga ke Google Spreadsheet jika SPREADSHEET_ID diisi
    if (APP_CONFIG.SPREADSHEET_ID) {
      exportToSpreadsheet('LKE_DATA', items);
    }
    
    return { success: true, count: Array.isArray(items) ? items.length : 0 };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Mengambil data LKE yang tersimpan
 */
function getLKEData() {
  try {
    var props = PropertiesService.getScriptProperties();
    var data = props.getProperty('DATA_LKE');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Menyimpan data KKE PD ke Script Properties
 */
function saveKKEData(items) {
  try {
    var jsonString = typeof items === 'string' ? items : JSON.stringify(items);
    var props = PropertiesService.getScriptProperties();
    props.setProperty('DATA_KKE_PD', jsonString);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Mengambil data KKE PD
 */
function getKKEData() {
  try {
    var props = PropertiesService.getScriptProperties();
    var data = props.getProperty('DATA_KKE_PD');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Mengunggah berkas evidence (PDF, Excel, Word, ZIP) langsung ke Google Drive
 * @param {string} base64Data - Konten berkas berformat Base64
 * @param {string} fileName - Nama berkas
 * @param {string} mimeType - Tipe MIME berkas
 * @returns {object} info berkas yang diunggah beserta link Google Drive
 */
function uploadEvidenceToDrive(base64Data, fileName, mimeType) {
  try {
    // Bersihkan header Data URL jika ada (misal: data:application/pdf;base64,...)
    var cleanBase64 = base64Data;
    if (base64Data.indexOf('base64,') > -1) {
      cleanBase64 = base64Data.split('base64,')[1];
    }
    
    var decoded = Utilities.base64Decode(cleanBase64);
    var blob = Utilities.newBlob(decoded, mimeType || 'application/octet-stream', fileName);
    
    var targetFolder;
    if (APP_CONFIG.DRIVE_FOLDER_ID) {
      targetFolder = DriveApp.getFolderById(APP_CONFIG.DRIVE_FOLDER_ID);
    } else {
      // Buat atau gunakan folder default
      var folderName = 'E-SAKIP_Evidence_Luwu_Utara';
      var folders = DriveApp.getFoldersByName(folderName);
      if (folders.hasNext()) {
        targetFolder = folders.next();
      } else {
        targetFolder = DriveApp.createFolder(folderName);
      }
    }
    
    var file = targetFolder.createFile(blob);
    // Berikan izin akses baca bagi yang memiliki tautan
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      success: true,
      fileId: file.getId(),
      fileName: file.getName(),
      fileSize: file.getSize(),
      viewUrl: file.getUrl(),
      downloadUrl: file.getDownloadUrl()
    };
  } catch (e) {
    return {
      success: false,
      error: e.toString()
    };
  }
}

/**
 * Ekspor data ke Google Spreadsheet jika dikonfigurasi
 */
function exportToSpreadsheet(sheetName, items) {
  if (!APP_CONFIG.SPREADSHEET_ID || !Array.isArray(items)) return;
  try {
    var ss = SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    sheet.clear();
    
    if (items.length === 0) return;
    
    var headers = Object.keys(items[0]);
    var rows = [headers];
    
    for (var i = 0; i < items.length; i++) {
      var row = [];
      for (var h = 0; h < headers.length; h++) {
        var val = items[i][headers[h]];
        if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        row.push(val !== undefined && val !== null ? val : '');
      }
      rows.push(row);
    }
    
    sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#E2E8F0');
  } catch (e) {
    Logger.log('Gagal menyimpan ke spreadsheet: ' + e.toString());
  }
}
