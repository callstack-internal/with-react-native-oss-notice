class WithReactNativeOSSNoticeTableViewController: UITableViewController {
    private let CELL_IDENTIFIER = "OSSNoticeCell"
    
    private var data: [WithReactNativeOSSNoticeLicenseMetadata] = [] {
        didSet {
            tableView.reloadData()
        }
    }
    
    public convenience init(title: String, data: Array<WithReactNativeOSSNoticeLicenseMetadata>) {
        if #available(iOS 13.0, *) {
            self.init(style: .insetGrouped)
        } else {
            self.init(style: .grouped)
        }
        self.title = title
        self.data = data
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        setupCloseButton()
    }
    
    @objc func dismissTableViewController(_ sender: AnyObject) {
        self.navigationController?.dismiss(animated: true)
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let dequeuedCell = tableView.dequeueReusableCell(withIdentifier: CELL_IDENTIFIER) ?? UITableViewCell(style: UITableViewCell.CellStyle.default, reuseIdentifier: CELL_IDENTIFIER)

        let metadata = data[indexPath.row]

        dequeuedCell.textLabel?.text = metadata.name
        dequeuedCell.accessoryType = UITableViewCell.AccessoryType.disclosureIndicator

        return dequeuedCell
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let metadata = data[indexPath.row]
        let detailViewController = WithReactNativeOSSNoticeDetailViewController(metadata: metadata)

        self.navigationController?.pushViewController(detailViewController, animated: true)
    }
    
    private func setupCloseButton() {
        var barButtonSystemItem: UIBarButtonItem.SystemItem = .done
        if #available(iOS 13.0, *) {
            barButtonSystemItem = .close
        }

        self.navigationItem.leftBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: barButtonSystemItem,
            target: self,
            action: #selector(dismissTableViewController(_:))
        )
    }
}
