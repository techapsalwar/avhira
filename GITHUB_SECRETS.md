# 🔐 GitHub Secrets Configuration for Avhira Deployment

## Add these secrets to: https://github.com/techapsalwar/avhira/settings/secrets/actions

### Secret 1: HOSTINGER_HOST
```
89.117.188.174
```

### Secret 2: HOSTINGER_USERNAME
```
u885878505
```

### Secret 3: HOSTINGER_PORT
```
65002
```

### Secret 4: HOSTINGER_APP_PATH
```
/home/u885878505/domains/avhira.com/public_html
```

### Secret 5: HOSTINGER_SSH_KEY
```
Copy the entire content of: C:\Users\[YourUsername]\.ssh\avhira_deploy
Including the -----BEGIN OPENSSH PRIVATE KEY----- and -----END OPENSSH PRIVATE KEY----- lines
```

---

## 📝 How to Add Secrets

1. Go to: https://github.com/techapsalwar/avhira/settings/secrets/actions
2. Click "New repository secret"
3. For each secret above:
   - Name: Enter the secret name (e.g., `HOSTINGER_HOST`)
   - Value: Copy the value from above
   - Click "Add secret"
4. Repeat for all 5 secrets

---

## ✅ Verification Checklist

- [ ] HOSTINGER_HOST = `89.117.188.174`
- [ ] HOSTINGER_USERNAME = `u885878505`
- [ ] HOSTINGER_PORT = `65002`
- [ ] HOSTINGER_APP_PATH = `/home/u885878505/domains/avhira.com/public_html`
- [ ] HOSTINGER_SSH_KEY = (entire private key content)

---

## 🚀 Next Steps After Adding Secrets

1. Test SSH connection (run deployment-setup.ps1)
2. Prepare Hostinger server (create .env file)
3. Push workflow to GitHub
4. Deploy!
