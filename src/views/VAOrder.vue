<template lang="html">
  <div>
    <v-app-bar app flat color="white" class="app-bar-no-padding">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div class="font-18 font-weight-bold">
                {{ $t('product.bank_transfer') }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <div class="mb-2 d-flex align-center">
            <div class="font-18 font-weight-bold">
              {{ $t('dialog.pay_to') }}
            </div>
            <v-spacer />
            <div v-if="!$isEmpty(order.payment_log)">
              <v-img :src="order.payment_log.payment_image" contain width="50" height="28" />
            </div>
          </div>
          <div v-if="!$isEmpty(order.payment_log)" class="card--input d-flex align-center pa-4">
            <div class="font-weight-bold font-18">
              {{ order.payment_log.va_account_number }}
            </div>
            <v-spacer />
            <input id="va_account_number" type="hidden" :value="order.payment_log.va_account_number">
            <v-btn class="ml-2" text icon color="primary" @click="copyText()">
              <v-icon small>
                mdi-content-copy
              </v-icon>
            </v-btn>
          </div>
          <div v-if="!$isEmpty(order.payment_log)" class="mt-6">
            <div class="container-time">
              <div class="va-icon-time">
                <v-icon color="#FF931E">
                  mdi-clock
                </v-icon>
              </div>
              <div class="va-content-time">
                <div class="va-content-title">
                  {{ $t('dialog.finish_payment_before') }}
                </div>
                <div class="va-content-subtitle">
                  {{ formatDate }}
                </div>
              </div>
              <div class="va-action">
                <div class="va-action-time">
                  {{ formatTime }}
                </div>
              </div>
            </div>
          </div>
          <v-btn color="#F5F5F5" height="40" block class="text-none mt-6 font-weight-bold border-radius-5" @click="goToOrder(order.id)">
            {{ $t('dialog.detail_order') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" md="4" offset-md="4">
          <v-expansion-panels v-if="order.payment_log && order.payment_log.va_bank_code" v-model="panel_va" class="panel-guide">
            <template v-if="order.payment_log.va_bank_code === 'MANDIRI'">
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  ATM
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Masukkan kartu ATM dan pilih "Bahasa Indonesia"
                    </li>
                    <li>
                      Ketik nomor PIN dan tekan BENAR
                    </li>
                    <li>
                      Pilih menu “BAYAR/BELI”
                    </li>
                    <li>
                      Pilih menu “MULTI PAYMENT”
                    </li>
                    <li>
                      Ketik kode perusahaan, yaitu "88908" (Xendit 88908), tekan "BENAR"
                    </li>
                    <li>
                      Masukkan nomor Virtual Account (<strong>{{ order.payment_log.va_account_number }}</strong>)
                    </li>
                    <li>
                      Isi NOMINAL, kemudian tekan "BENAR"
                    </li>
                    <li>
                      Muncul konfirmasi data customer. Pilih Nomor 1 sesuai tagihan yang akan dibayar, kemudian tekan "YA"
                    </li>
                    <li>
                      Muncul konfirmasi pembayaran. Tekan "YA" untuk melakukan pembayaran
                    </li>
                    <li>
                      Bukti pembayaran dalam bentuk struk agar disimpan sebagai bukti pembayaran yang sah dari Bank Mandiri
                    </li>
                    <li>
                      Transaksi Anda sudah selesai
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Mobile Banking
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Log in Mobile Banking Mandiri Online
                    </li>
                    <li>
                      Klik “Icon Menu” di sebelah kiri atas
                    </li>
                    <li>
                      Pilih menu “Pembayaran”
                    </li>
                    <li>
                      Pilih “Buat Pembayaran Baru”
                    </li>
                    <li>
                      Pilih “Multi Payment”
                    </li>
                    <li>
                      Pilih Penyedia Jasa “Xendit 88908”
                    </li>
                    <li>
                      Pilih “No. Virtual”
                    </li>
                    <li>
                      Masukkan no virtual account anda (<strong>{{ order.payment_log.va_account_number }}</strong>) lalu pilih “Tambah Sebagai Nomor Baru”
                    </li>
                    <li>
                      Masukkan “Nominal” lalu pilih “Konfirmasi”
                    </li>
                    <li>
                      Pilih “Lanjut”
                    </li>
                    <li>
                      Muncul tampilan konfirmasi pembayaran
                    </li>
                    <li>
                      Scroll ke bawah di tampilan konfirmasi pembayaran lalu pilih “Konfirmasi”
                    </li>
                    <li>
                      Masukkan “PIN” dan transaksi telah selesai
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Internet Banking
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Kunjungi website Mandiri Internet Banking:
                      <a href="https://ibank.bankmandiri.co.id/retail3/" target="_blank">
                        klik disini
                      </a>
                    </li>
                    <li>
                      Login dengan memasukkan USER ID dan PIN
                    </li>
                    <li>
                      Pilih "Pembayaran"
                    </li>
                    <li>
                      Pilih "Multi Payment"
                    </li>
                    <li>
                      Pilih "No Rekening Anda"
                    </li>
                    <li>
                      Pilih Penyedia Jasa "Xendit 88908"
                    </li>
                    <li>
                      Pilih "No Virtual Account"
                    </li>
                    <li>
                      Masukkan nomor Virtual Account anda (<strong>{{ order.payment_log.va_account_number }}</strong>)
                    </li>
                    <li>
                      Masuk ke halaman konfirmasi 1
                    </li>
                    <li>
                      Apabila benar/sesuai, klik tombol tagihan TOTAL, kemudian klik "LANJUTKAN"
                    </li>
                    <li>
                      Masuk ke halaman konfirmasi 2
                    </li>
                    <li>
                      Masukkan Challenge Code yang dikirimkan ke Token Internet Banking Anda, kemudian klik "Kirim"
                    </li>
                    <li>
                      Anda akan masuk ke halaman konfirmasi jika pembayaran telah selesai
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
            <template v-if="order.payment_log.va_bank_code === 'BNI'">
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  ATM
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Masukkan Kartu Anda.
                    </li>
                    <li>
                      Pilih Bahasa.
                    </li>
                    <li>
                      Masukkan PIN ATM Anda.
                    </li>
                    <li>
                      Pilih "Menu Lainnya".
                    </li>
                    <li>
                      Pilih "Transfer".
                    </li>
                    <li>
                      Pilih Jenis rekening yang akan Anda gunakan (Contoh: "Dari Rekening Tabungan").
                    </li>
                    <li>
                      Pilih “Virtual Account Billing” .
                    </li>
                    <li>
                      Masukkan nomor Virtual Account Anda (<strong>{{ order.payment_log.va_account_number }}</strong>).
                    </li>
                    <li>
                      Konfirmasi, apabila telah sesuai, lanjutkan transaksi.
                    </li>
                    <li>
                      Transaksi Anda telah selesai
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Mobile Banking BNI
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Akses BNI Mobile Banking dari handphone kemudian masukkan user ID dan password.
                    </li>
                    <li>
                      Pilih menu “Transfer”.
                    </li>
                    <li>
                      Pilih menu “Virtual Account Billing” kemudian pilih rekening debet.
                    </li>
                    <li>
                      Masukkan nomor Virtual Account Anda (<strong>{{ order.payment_log.va_account_number }}</strong>) pada menu “input baru”.
                    </li>
                    <li>
                      Konfirmasi transaksi anda
                    </li>
                    <li>
                      Masukkan Password Transaksi.
                    </li>
                    <li>
                      Pembayaran Anda Telah Berhasil.
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Internet Banking BNI
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Ketik alamat https://ibank.bni.co.id kemudian klik “Enter” atau
                      <a href="https://ibank.bni.co.id" target="_blank">klik disini</a>.
                    </li>
                    <li>
                      Masukkan User ID dan Password.
                    </li>
                    <li>
                      Pilih menu “Transfer”
                    </li>
                    <li>
                      Pilih “Virtual Account Billing”.
                    </li>
                    <li>
                      Kemudian masukan nomor Virtual Account Anda (<strong>{{ order.payment_log.va_account_number }}</strong>) yang hendak dibayarkan. Lalu pilih rekening debet yang akan digunakan. Kemudian tekan ‘’lanjut’’
                    </li>
                    <li>
                      Periksa ulang mengenai transaksi yang anda ingin lakukan
                    </li>
                    <li>
                      Masukkan Kode Otentikasi Token.
                    </li>
                    <li>
                      Pembayaran Anda berhasil
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
            <template v-if="order.payment_log.va_bank_code === 'BRI'">
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  ATM
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Pilih menu Transaksi Lain
                    </li>
                    <li>
                      Pilih menu Lainnya
                    </li>
                    <li>
                      Pilih menu Pembayaran
                    </li>
                    <li>
                      Pilih menu Lainnya
                    </li>
                    <li>
                      Pilih menu BRIVA
                    </li>
                    <li>
                      Masukkan Nomor BRI Virtual Account (<strong>{{ order.payment_log.va_account_number }}</strong>), lalu tekan “Benar”
                    </li>
                    <li>
                      Konfirmasi pembayaran, tekan “Ya” bila sesuai
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Mobile Banking
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Log in ke Mobile Banking
                    </li>
                    <li>
                      Pilih menu Pembayaran
                    </li>
                    <li>
                      Pilih menu BRIVA
                    </li>
                    <li>
                      Masukkan nomor BRI Virtual Account (<strong>{{ order.payment_log.va_account_number }}</strong>) dan jumlah pembayaran
                    </li>
                    <li>
                      Masukkan nomor PIN anda
                    </li>
                    <li>
                      Tekan “OK” untuk melanjutkan transaksi
                    </li>
                    <li>
                      Transaksi berhasil
                    </li>
                    <li>
                      SMS konfirmasi akan masuk ke nomor telepon anda
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Internet Banking
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Masukan User ID dan Password
                    </li>
                    <li>
                      Pilih menu Pembayaran
                    </li>
                    <li>
                      Pilih menu BRIVA
                    </li>
                    <li>
                      Pilih rekening Pembayar
                    </li>
                    <li>
                      Masukkan Nomor Virtual Account BRI Anda (<strong>{{ order.payment_log.va_account_number }}</strong>)
                    </li>
                    <li>
                      Masukkan nominal yang akan dibayar
                    </li>
                    <li>
                      Masukkan password dan Mtoken anda
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
            <template v-if="order.payment_log.va_bank_code === 'PERMATA'">
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  ATM PRIMA / ALTO:
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Pada menu utama, pilih transaksi lain
                    </li>
                    <li>
                      Pilih Pembayaran Transfer
                    </li>
                    <li>
                      Pilih pembayaran lainnya
                    </li>
                    <li>
                      Pilih pembayaran Virtual Account
                    </li>
                    <li>
                      Masukkan nomor virtual account anda (<strong>{{ order.payment_log.va_account_number }}</strong>)
                    </li>
                    <li>
                      Pada halaman konfirmasi, akan muncul nominal yang dibayarkan, nomor, dan nama merchant, lanjutkan jika sudah sesuai
                    </li>
                    <li>
                      Pilih sumber pembayaran anda dan lanjutkan
                    </li>
                    <li>
                      Transaksi anda selesai
                    </li>
                    <li>
                      Ketika transaksi anda sudah selesai, invoice anda akan diupdate secara otomatis. Ini mungkin memakan waktu hingga 5 menit.
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Permata Mobile X
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Buka Permata Mobile X dan Login
                    </li>
                    <li>
                      Pilih Pay "Pay Bills"/ "Pembayaran Tagihan"
                    </li>
                    <li>
                      Pilih “Virtual Account”
                    </li>
                    <li>
                      Masukkan Nomor Virtual Account anda (<strong>{{ order.payment_log.va_account_number }}</strong>)
                    </li>
                    <li>
                      Detail pembayaran anda akan muncul di layar
                    </li>
                    <li>
                      Nominal yang ditagihkan akan muncul di layar. Pilih sumber pembayaran
                    </li>
                    <li>
                      Konfirmasi transaksi anda
                    </li>
                    <li>
                      Masukkan kode response token anda
                    </li>
                    <li>
                      Transaksi anda telah selesai
                    </li>
                    <li>
                      Ketika transaksi anda sudah selesai, invoice anda akan diupdate secara otomatis. Ini mungkin memakan waktu hingga 5 menit.
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Permata Mobile
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Buka Permata Mobile dan Login
                    </li>
                    <li>
                      Pilih Pay "Pay Bills"/ "Pembayaran Tagihan"
                    </li>
                    <li>
                      Pilih menu “Transfer”
                    </li>
                    <li>
                      Pilih sumber pembayaran
                    </li>
                    <li>
                      Pilih “daftar tagihan baru”
                    </li>
                    <li>
                      Masukan nomor Virtual Account Anda (<strong>{{ order.payment_log.va_account_number }}</strong>)
                    </li>
                    <li>
                      Periksa ulang mengenai transaksi yang anda ingin lakukan
                    </li>
                    <li>
                      Konfirmasi transaksi anda
                    </li>
                    <li>
                      Masukkan SMS token respons
                    </li>
                    <li>
                      Pembayaran Anda berhasil
                    </li>
                    <li>
                      Ketika transaksi anda sudah selesai, invoice anda akan diupdate secara otomatis. Ini mungkin memakan waktu hingga 5 menit.
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Internet Banking Permata (PermataNet)
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Buka situs https://new.permatanet.com atau
                      <a href="https://new.permatanet.com" target="_blank">klik disini</a>
                      dan login
                    </li>
                    <li>
                      Pilih menu “pembayaran”.
                    </li>
                    <li>
                      Pilih menu “Pembayaran Tagihan”.
                    </li>
                    <li>
                      Pilih “Virtual Account”
                    </li>
                    <li>
                      Pilih sumber pembayaran
                    </li>
                    <li>
                      Pilih menu "Masukkan Daftar Tagihan Baru"
                    </li>
                    <li>
                      Masukan nomor Virtual Account Anda (<strong>{{ order.payment_log.va_account_number }}</strong>)
                    </li>
                    <li>
                      Konfirmasi transaksi anda
                    </li>
                    <li>
                      Masukkan SMS token response
                    </li>
                    <li>
                      Pembayaran Anda berhasil
                    </li>
                    <li>
                      Ketika transaksi anda sudah selesai, invoice anda akan diupdate secara otomatis. Ini mungkin memakan waktu hingga 5 menit
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
            <template v-if="order.payment_log.va_bank_code === 'BCA'">
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  BCA M-Mobile
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Buka Aplikasi BCA Mobile
                    </li>
                    <li>
                      Pilih "m-BCA", kemudian pilih "m-Transfer"
                    </li>
                    <li>
                      Pilih "BCA Virtual Account"
                    </li>
                    <li>
                      Masukkan nomor Virtual Account <strong>{{ order.payment_log.va_account_number }}</strong>, lalu pilih "OK"
                    </li>
                    <li>
                      Klik tombol "Send" yang berada di sudut kanan atas aplikasi untuk melakukan transfer
                    </li>
                    <li>
                      Klik "OK" untuk melanjutkan pembayaran
                    </li>
                    <li>
                      Masukkan PIN Anda untuk meng-otorisasi transaksi
                    </li>
                    <li>
                      Setelah transaksi pembayaran Anda selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan waktu hingga 5 menit.
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  ATM
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Masukkan kartu ATM dan PIN BCA Anda
                    </li>
                    <li>
                      Di menu utama, pilih "Transaksi Lainnya". Pilih "Transfer". Pilih "Ke BCA Virtual Account"
                    </li>
                    <li>
                      Masukkan nomor Virtual Account <strong>{{ order.payment_log.va_account_number }}</strong>
                    </li>
                    <li>
                      Pastikan data Virtual Account Anda benar, kemudian masukkan angka yang perlu Anda bayarkan, kemudian pilih "Benar"
                    </li>
                    <li>
                      Cek dan perhatikan konfirmasi pembayaran dari layar ATM, jika sudah benar pilih "Ya", atau pilih "Tidak" jika data di layar masih salah
                    </li>
                    <li>
                      Transaksi Anda sudah selesai. Pilih "Tidak" untuk tidak melanjutkan transaksi lain
                    </li>
                    <li>
                      Setelah transaksi pembayaran Anda selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan waktu hingga 5 menit.
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  IBanking
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Login ke KlikBCA Individual
                    </li>
                    <li>
                      Pilih "Transfer", kemudian pilih "Transfer ke BCA Virtual Account"
                    </li>
                    <li>
                      Masukkan nomor Virtual Account <strong>{{ order.payment_log.va_account_number }}</strong>
                    </li>
                    <li>
                      Pilih "Lanjutkan" untuk melanjutkan pembayaran
                    </li>
                    <li>
                      Masukkan "RESPON KEYBCA APPLI 1" yang muncul pada Token BCA Anda, lalu klik tombol "Kirim"
                    </li>
                    <li>
                      Transaksi Anda sudah selesai
                    </li>
                    <li>
                      Setelah transaksi pembayaran Anda selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan waktu hingga 5 menit.
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
            <template v-if="order.payment_log.va_bank_code === 'SAHABAT_SAMPOERNA'">
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  ATM
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Pilih menu Transaksi Lainnya
                    </li>
                    <li>
                      Pilih menu Transfer
                    </li>
                    <li>
                      Pilih menu Transfer ke Bank Sahabat Sampoerna
                    </li>
                    <li>
                      Masukkan nomor Virtual Account (<strong>{{ order.payment_log.va_account_number }}</strong>), lalu tekan “Benar”
                    </li>
                    <li>
                      Cek kembali transaksi Anda
                    </li>
                    <li>
                      Konfirmasi pembayaran, tekan “Ya” bila sesuai
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Mobile Banking
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Log in ke Mobile Banking
                    </li>
                    <li>
                      Pilih menu Transfer Dana
                    </li>
                    <li>
                      Pilih menu Transfer ke Antar Bank
                    </li>
                    <li>
                      Masukkan kode Bank Sahabat Sampoerna yaitu "523"
                    </li>
                    <li>
                      Masukkan nomor Virtual Account (<strong>{{ order.payment_log.va_account_number }}</strong>) dan jumlah pembayaran
                    </li>
                    <li>
                      Masukkan token M-Banking Anda
                    </li>
                    <li>
                      Transaksi berhasil
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Internet Banking
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ol>
                    <li>
                      Login akun Internet Banking
                    </li>
                    <li>
                      Pilih menu Transfer Dana
                    </li>
                    <li>
                      Pilih menu Transfer ke Rekening Bank Sahabat Sampoerna
                    </li>
                    <li>
                      Masukkan Nomor Virtual Account (<strong>{{ order.payment_log.va_account_number }}</strong>)
                    </li>
                    <li>
                      Masukkan nominal yang akan dibayar
                    </li>
                    <li>
                      Masukkan token i-Banking Anda
                    </li>
                  </ol>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar.show">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>
            {{ snackbar.text }}
          </div>
          <v-btn class="transparent" text fab x-small dark @click="snackbar.show = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import { order } from '@/api/order'
export default {
  data() {
    return {
      panel_va: [0, 1],
      order: {},
      timerInterval: null,
      distance: 0,
      snackbar: {
        show: false,
        text: ''
      }
    }
  },
  computed: {
    formatDate() {
      if (!this.$isEmpty(this.order.payment_log)) {
        return this.frmtDate(new Date(this.order.payment_log.expired_at))
      } else {
        return this.frmtDate(new Date())
      }
    },
    formatTime() {
      let hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60))
      let result
      if (this.distance < 0) {
        result = 'EXPIRED'
      } else {
        hours = hours < 10 ? hours === 0 ? '' : '0' + hours + 'h ' : hours + 'h '
        minutes = minutes < 10 ? '0' + minutes + 'm' : minutes + 'm'
        result = hours + minutes
      }
      return result
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))) {
      this.order = JSON.parse(localStorage.getItem(process.env.VUE_APP_COOKIE_KEY + '_order'))
      const time = this.order.payment_log.expired_at
      this.getExpiryTime(time)
    } else {
      this.getOrder()
    }
    this.$store.dispatch('remove_cart')
  },
  methods: {
    frmtDate(date) {
      const tahun = date.getFullYear()
      let bulan = date.getMonth()
      const tanggal = date.getDate()
      switch (bulan) {
        case 0: bulan = this.$t('global.date.january'); break
        case 1: bulan = this.$t('global.date.february'); break
        case 2: bulan = this.$t('global.date.march'); break
        case 3: bulan = this.$t('global.date.april'); break
        case 4: bulan = this.$t('global.date.may'); break
        case 5: bulan = this.$t('global.date.june'); break
        case 6: bulan = this.$t('global.date.july'); break
        case 7: bulan = this.$t('global.date.august'); break
        case 8: bulan = this.$t('global.date.september'); break
        case 9: bulan = this.$t('global.date.october'); break
        case 10: bulan = this.$t('global.date.november'); break
        case 11: bulan = this.$t('global.date.december'); break
      }
      return tanggal + ' ' + bulan + ' ' + tahun
    },
    goToOrder(id) {
      this.$router.push({ name: 'order', params: { id: id }}).catch(() => {})
    },
    async getOrder() {
      try {
        const { data } = await order(this.$route.params.id)
        this.order = data.data
        const time = this.order.payment_log.expired_at
        this.getExpiryTime(time)
      } catch (e) {
        this.order = {}
        this.$store.dispatch('showAlert', {
          type: 'error',
          show: true,
          message: e.message
        })
      }
    },
    copyText() {
      const testingCodeToCopy = document.querySelector('#va_account_number')
      testingCodeToCopy.setAttribute('type', 'text')
      testingCodeToCopy.select()
      try {
        var successful = document.execCommand('copy')
        var msg = successful ? 'successfully' : 'unsuccessful'
        this.snackbar.show = true
        this.snackbar.text = 'Number was copied ' + msg
      } catch (err) {
        this.snackbar.show = true
        this.snackbar.text = 'Oops, unable to copy'
      }
      testingCodeToCopy.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
    getExpiryTime(time) {
      var countDownDate = new Date(time).getTime()
      const _this = this
      this.timerInterval = setInterval(function() {
        var now = new Date().getTime()
        _this.distance = countDownDate - now
        if (_this.distance < 0) {
          clearInterval(_this.timerInterval)
        }
      }, 1000)
    }
  }
}
</script>
