const fs = require('fs');
const filePath = './counter.json';
class CreateID {
    getCounters() {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({})); // Tạo file nếu chưa tồn tại
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data;
    }

    saveCounters(data) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4)); // Ghi dữ liệu với format đẹp
    }

    incrementCounter(prefix) {
        try {
            const data = this.getCounters();
            if (!data[prefix]) {
                data[prefix] = 0; // Nếu prefix chưa tồn tại, khởi tạo giá trị
            }

            data[prefix]++; // Tăng giá trị counter
            this.saveCounters(data); // Lưu lại vào file
            return data[prefix];
        } catch (err) {
            return err.message
        }
    };

    generateID(prefix) {
        const counter = this.incrementCounter(prefix);
        return `${prefix}${counter}`;
    }
}
module.exports = new CreateID